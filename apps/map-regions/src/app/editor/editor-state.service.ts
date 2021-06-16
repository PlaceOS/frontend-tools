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

    constructor(private _clipboard: Clipboard) {
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
    }

    public handleMapClick(event: 'start' | 'move' | 'end', point: Point) {
        const active_region = this._active_region.getValue();
        if (
            !active_region ||
            !point ||
            (event === 'move' && !this._start_point)
        )
            return;
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
                action: 'update',
                name: 'map_region',
                content: data,
            });
        } else {
            downloadFile('map-region-data.json', JSON.stringify(data));
        }
    }

    public copyMetadata() {
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
