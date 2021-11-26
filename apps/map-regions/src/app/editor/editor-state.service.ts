import { Injectable } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import {
    downloadFile,
    isChildFrame,
    randomString,
    retrieveData,
    sendMessage,
} from '@placeos-tools/common';
import { Point } from '@placeos/svg-viewer';
import { BehaviorSubject } from 'rxjs';

import { MapRegion } from './types';

export const COLOURS = [
    '#e53935',
    '#d81b60',
    '#8e24aa',
    '#5e35b1',
    '#3949ab',
    '#1e88e5',
    '#039be5',
    '#00acc1',
    '#00897b',
    '#43a047',
    '#7cb342',
    '#c0ca33',
    '#fdd835',
    '#ffb300',
    '#fb8c00',
    '#f4511e',
];

const formatRegion = (r) => {
    const updated = {
        id: `${r.name.toLowerCase().split(' ').join('-')}`,
        type: 'Feature',
        feature_type: 'section',
        geometry: {
            type: 'Polygon',
            coordinates: r.points,
        },
        properties: {
            name: r.name,
            capacity: r.capacity,
        },
    };
    return updated;
};

@Injectable({
    providedIn: 'root',
})
export class EditorStateService {
    private _map_url = new BehaviorSubject<string>('');
    private _map_width = new BehaviorSubject<number>(100);
    private _map_height = new BehaviorSubject<number>(100);
    private _embeded = new BehaviorSubject<boolean>(false);
    private _map_regions = new BehaviorSubject<MapRegion[]>([]);
    private _active_region = new BehaviorSubject<MapRegion>(null);

    private _start_point: Point;
    private _end_point: Point;
    private _shift: boolean;
    private _move: boolean;
    private _action: 'rect' | 'add_points' | 'remove_points' = 'rect';
    /** URL of the map to be displayed */
    public readonly url = this._map_url.asObservable();
    /** Regions for the active map URL */
    public readonly regions = this._map_regions.asObservable();
    /** Whether application is embeded within another */
    public readonly embeded = this._embeded.asObservable();
    /** Region currently being worked on */
    public readonly active_region = this._active_region.asObservable();
    /** Height of the active map */
    public readonly height = this._map_height.asObservable();
    /** Width of the active map */
    public readonly width = this._map_width.asObservable();

    public get action() {
        return this._action;
    }

    constructor(private _clipboard: Clipboard) {
        document.addEventListener('keydown', (ev) => ev.key === 'Shift' ? this._shift = true: '');
        document.addEventListener('keyup', (ev) => ev.key === 'Shift' ? this._shift = false: '');
        this.loadRegionData();
    }

    /** Update the map URL */
    public setURL(url: string) {
        this._map_url.next(url);
    }

    /** Update the active region */
    public setActiveRegion(region: MapRegion) {
        this._active_region.next(region);
    }

    public setWidth(w: number) {
        this._map_width.next(w);
    }

    public setHeight(h: number) {
        this._map_height.next(h);
    }

    public setRatio(r: number) {
        this._map_height.next(
            Math.floor(this._map_width.getValue() * r * 100) / 100
        );
        setTimeout(
            () => this._map_regions.next(this._map_regions.getValue()),
            200
        );
    }

    public setAction(action: 'rect' | 'add_points' | 'remove_points') {
        this._action = action;
        this._cleanUpPoint();
    }

    public handleMapClick(event: 'start' | 'move' | 'end', point: Point) {
        switch (this._action) {
            case 'add_points':
                event === 'move' 
                    ? this.handleMovePoint(point) 
                    : (event === 'end' ? this.handleAddPoints(point) : '');
                break;
            case 'remove_points':
                event === 'end' ? this.handleRemovePoint(point) : '';
                break;
            default:
                this.handleRect(event, point);
        }
    }

    private _cleanUpPoint() {
        if (this._move) {
            const active_region = this._active_region.getValue();
            this.replaceRegion(active_region.id, {
                ...active_region,
                points: [
                    ...active_region.points.slice(0, -1),
                ],
            });
            const updated_region = this._map_regions
                .getValue()
                .find((_) => _.id === active_region.id);
            this._active_region.next(updated_region);
            this._move = false;
        }
    }

    private handleAddPoints({ x, y }: Point) {
        console.log('Add Point');
        const active_region = this._active_region.getValue();
        if (!active_region) return;
        x = Math.floor(x * 200) / 200; 
        y = Math.floor(y * 200) / 200;
        if (this._shift && active_region.points?.length) {
            const [x1, y1] = active_region.points[active_region.points.length - 1];
            const angle = Math.atan2(y - y1, x - x1) / Math.PI * 180 + 90;
            if ((angle >= 0 && angle < 30) || (angle >= 150 && angle < 210) || (angle >= 330)) x = x1;
            else if ((angle >= 60 && angle < 120) || (angle >= 240 && angle < 300)) y = y1;
            else x = x1 + (y - y1);
        }
        const len = active_region.points.length;
        this.replaceRegion(active_region.id, {
            ...active_region,
            points: [
                ...active_region.points.slice(0, this._move ? -1 : len),
                [+x.toFixed(4), +y.toFixed(4)],
            ],
        });
        const updated_region = this._map_regions
            .getValue()
            .find((_) => _.id === active_region.id);
        this._active_region.next(updated_region);
        this._move = false;
    }

    private handleMovePoint({ x, y }: Point) {
        const active_region = this._active_region.getValue();
        if (!active_region) return;
        x = Math.floor(x * 200) / 200; 
        y = Math.floor(y * 200) / 200;
        if (this._shift && active_region.points?.length) {
            const [x1, y1] = active_region.points[active_region.points.length - 1];
            const angle = Math.atan2(y - y1, x - x1) / Math.PI * 180 + 90;
            if ((angle >= 0 && angle < 30) || (angle >= 150 && angle < 210) || (angle >= 330)) x = x1;
            else if ((angle >= 60 && angle < 120) || (angle >= 240 && angle < 300)) y = y1;
            else x = x1 + (y - y1);
        }
        const len = active_region.points.length;
        this.replaceRegion(active_region.id, {
            ...active_region,
            points: [
                ...active_region.points.slice(0, this._move ? -1 : len),
                [+x.toFixed(4), +y.toFixed(4)],
            ],
        });
        const updated_region = this._map_regions
            .getValue()
            .find((_) => _.id === active_region.id);
        this._active_region.next(updated_region);
        this._move = true;
    }

    private handleRemovePoint({ x, y }: Point) {
        x = +x.toFixed(4);
        y = +y.toFixed(4);
        const active_region = this._active_region.getValue();
        if (!active_region) return;
        let closest_point: [number, number] = null;
        let closest_dist = 99999;
        for (const [px, py] of active_region.points) {
            const dist = Math.sqrt((px - x) * (px - x) + (py - y) * (py - y));
            if (dist < closest_dist) {
                closest_point = [px, py];
                closest_dist = dist;
            }
        }
        if (!closest_point || closest_dist > 0.02) return;
        this.replaceRegion(active_region.id, {
            ...active_region,
            points: active_region.points.filter(
                ([x, y]) => closest_point[0] !== x || closest_point[1] !== y
            ),
        });
        const updated_region = this._map_regions
            .getValue()
            .find((_) => _.id === active_region.id);
        this._active_region.next(updated_region);
    }

    private handleRect(event: 'start' | 'move' | 'end', { x, y }: Point = {}) {
        const active_region = this._active_region.getValue();
        if (
            !active_region ||
            !x ||
            (event === 'move' && !this._start_point)
        )
            return;
        const point = { x: Math.floor(x * 200) / 200, y: Math.floor(y * 200) / 200 };
        switch (event) {
            case 'start':
                this._start_point = point;
                this._end_point = point;
                break;
            case 'move':
                this._end_point = point;
                break;
            case 'end':
                this._end_point = point;
                setTimeout(() => (this._start_point = null), 20);
                break;
        }
        if (!this._start_point || !this._end_point) return;
        this.replaceRegion(active_region.id, {
            ...active_region,
            points: [
                [this._start_point.x, this._start_point.y],
                [this._end_point.x, this._start_point.y],
                [this._end_point.x, this._end_point.y],
                [this._start_point.x, this._end_point.y],
            ],
            width: Math.abs(this._start_point.x - this._end_point.x),
            height: Math.abs(this._start_point.y - this._end_point.y),
        });
        const updated_region = this._map_regions
            .getValue()
            .find((_) => _.id === active_region.id);
        this._active_region.next(updated_region);
    }

    /** Add new region to active map */
    public newRegion() {
        const regions = this._map_regions.getValue();
        const new_region: MapRegion = {
            id: randomString(12),
            name: `Area ${regions.length + 1}`,
            points: [[0, 0]],
            color: COLOURS[regions.length % COLOURS.length],
            capacity: 64,
        };
        this._map_regions.next([...regions, new_region]);
        this.setActiveRegion(new_region);
    }

    /** Remove a region from the active map */
    public removeRegion(region: MapRegion) {
        const regions = this._map_regions.getValue();
        const list = regions.filter((_) => _.id !== region.id);
        const active_region = this._active_region.getValue();
        this._map_regions.next(list);
        if (active_region?.id === region.id) {
            this._active_region.next(list[0] || null);
        }
    }

    public async saveMetadata() {
        this._cleanUpPoint();
        const embeded = this._embeded.getValue();
        const data = {
            url: this._map_url.getValue(),
            width: 0,
            height: 0,
            areas: this._map_regions.getValue().map(formatRegion),
        };
        if (embeded) {
            await sendMessage({
                type: 'backoffice',
                action: 'metadata',
                name: 'map_regions',
                content: data,
            });
        } else {
            downloadFile('map-region-data.json', JSON.stringify(data));
        }
    }

    public copyMetadata() {
        this._cleanUpPoint();
        const data = {
            url: this._map_url.getValue(),
            width: 0,
            height: 0,
            areas: this._map_regions.getValue().map(formatRegion),
        };
        this._clipboard.copy(JSON.stringify(data, null, 4));
    }

    private async loadRegionData() {
        const is_child = isChildFrame();
        this._embeded.next(is_child);
        if (!is_child) return;
        const data = await retrieveData('map_regions');
        const map_data = {
            height: data.height,
            width: data.width,
            areas: (data.areas || []).map(
                (i, idx) =>
                    ({
                        id: i.id,
                        color: COLOURS[idx % COLOURS.length],
                        name: i.properties.name,
                        capacity: i.properties.capacity,
                        points: i.geometry.coordinates,
                        height: Math.abs(
                            i.geometry.coordinates[0][1] -
                                i.geometry.coordinates[2][1]
                        ),
                        width: Math.abs(
                            i.geometry.coordinates[0][0] -
                                i.geometry.coordinates[2][0]
                        ),
                    } as any)
            ),
        };
        this.setHeight(map_data.height);
        this.setWidth(map_data.width);
        this._map_regions.next(map_data.areas);
    }

    private replaceRegion(id: string, new_data: MapRegion) {
        const regions = [...this._map_regions.getValue()];
        const index = regions.findIndex((_) => _.id === id);
        if (index > -1) {
            regions.splice(index, 1, new_data);
            this._map_regions.next(regions);
        }
    }
}
