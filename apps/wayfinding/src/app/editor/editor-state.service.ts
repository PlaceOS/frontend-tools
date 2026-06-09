import { Clipboard } from '@angular/cdk/clipboard';
import { computed, inject, Injectable, signal } from '@angular/core';
import {
    downloadFile,
    isChildFrame,
    retrieveData,
    sendMessage,
} from '@placeos-tools/common';
import { Point } from '@placeos-tools/components';
import { findPath } from './astar';
import { MapNavPathDisplayComponent } from './map-navpath-display.component';
import { MapWaypointDisplayComponent } from './map-waypoint-display.component';

const TYPES = ['temperature', 'humidity', 'presense'];
export type GridPoint = [number, number, boolean];
export type ActionMethod =
    | 'add'
    | 'remove'
    | 'link'
    | 'set-feature'
    | 'testing';

const MAX_DIST = 0.02;
const RES = 0.01;

@Injectable({
    providedIn: 'root',
})
export class EditorStateService {
    private _clipboard = inject(Clipboard);

    private _use_url = signal<string>('');
    private _map_url = signal<string>('');
    private _embeded = signal<boolean>(false);
    private _method = signal<ActionMethod>('add');
    private _active_point = signal<GridPoint>(null);

    private _grid_size = signal<[number, number]>([1000, 50]);
    private _navpath = signal<GridPoint[]>([]);
    private _waypoints = signal<GridPoint[]>([]);
    private _waypoints_links = signal<[GridPoint, GridPoint][]>([]);
    public readonly navpath = this._navpath.asReadonly();
    /** List of features to be displayed on the map */
    public readonly features = computed(() => {
        const points = this._waypoints();
        const active = this._active_point();
        const links = this._waypoints_links();
        const path_points = this._navpath();
        const method = this._method();
        const list: any[] = [
            {
                location: 'map-viewer-root',
                content: MapWaypointDisplayComponent,
                full_size: true,
                data: {
                    points,
                    links,
                    active,
                    ratio: 1,
                    testing: method === 'testing',
                },
            },
        ];
        if (method === 'testing' && (active || path_points)) {
            const points: GridPoint[] = path_points?.length
                ? path_points
                : [[active[0], active[1], true]];
            const nav_links = [];
            for (let i = 1; i < points.length; i++) {
                const link = links.find(
                    ([p1, p2]) =>
                        (isSamePoint(p1, points[i - 1]) &&
                            isSamePoint(p2, points[i])) ||
                        (isSamePoint(p2, points[i - 1]) &&
                            isSamePoint(p1, points[i])),
                );
                if (link) nav_links.push(link);
            }
            list.push({
                location: 'map-viewer-root',
                content: MapNavPathDisplayComponent,
                full_size: true,
                data: {
                    points,
                    links: nav_links,
                    ratio: 1,
                    color: '#1976d2',
                },
            });
        }
        return list;
    });
    /** URL of the map to be displayed */
    public readonly url = this._map_url.asReadonly();

    public readonly actions = signal([
        { id: '*', action: 'click', callback: (_, p) => this._handleClick(p) },
        {
            id: '*',
            action: 'touchend',
            callback: (_, p) => this._handleClick(p),
        },
    ]);
    /** Whether application is embeded within another */
    public readonly embeded = this._embeded.asReadonly();
    /** Size parameters for wayfinding grid */
    public readonly size = this._grid_size.asReadonly();
    /** Action method for wayfinding grid */
    public readonly method = this._method.asReadonly();

    constructor() {
        const is_child = isChildFrame();
        this._embeded.set(is_child);
        if (is_child) {
            this.loadWayfindingGrid();
        }
    }

    /** Update the map URL */
    public setURL(url: string, use_url: string = '') {
        this._map_url.set(url);
        this._use_url.set(use_url || url);
        setTimeout(() => this._waypoints.set(this._waypoints()), 1000);
    }

    public setMethod(method: ActionMethod) {
        this._method.set(method);
        this._active_point.set(null);
        this._navpath.set(null);
    }

    public toMetadataObject() {
        return {
            size: this._grid_size(),
            points: this._waypoints(),
            links: this._waypoints_links(),
        };
    }

    public async saveMetadata() {
        const embeded = this._embeded();
        if (embeded) {
            await sendMessage({
                type: 'backoffice',
                action: 'metadata',
                name: 'wayfinding-grid',
                content: this.toMetadataObject(),
            });
        } else {
            downloadFile(
                'wayfinding-grid-data.json',
                JSON.stringify(this.toMetadataObject()),
            );
        }
    }

    public copyMetadata() {
        this._clipboard.copy(JSON.stringify(this.toMetadataObject(), null, 4));
    }

    public async loadWayfindingGrid() {
        if (!this._embeded()) return;
        const { size, points, links } = await retrieveData('wayfinding-grid');
        this._waypoints.set(points);
        this._waypoints_links.set(links);
        this._grid_size.set(size);
    }

    private _handleClick(point: Point) {
        const x = Math.round(point.x * (1 / RES)) / (1 / RES);
        const y = Math.round(point.y * (1 / RES)) / (1 / RES);
        const method = this._method();
        if (method === 'add') this._handleAddWaypoint({ x, y });
        else if (method === 'remove') this._handleRemoveWaypoint({ x, y });
        else if (method === 'link') this._handleLinkWaypoint({ x, y });
        else if (method === 'set-feature') this._handleSetFeature({ x, y });
        else if (method === 'testing') this._handleTestNavigation({ x, y });
    }

    private _handleAddWaypoint({ x, y }: Point) {
        const waypoints = this._waypoints();
        const [nearest, dist] = nearestPoint(waypoints, [x, y]);
        if (nearest && dist < MAX_DIST) return;
        this._waypoints.set([...waypoints, [x, y, false]]);
    }

    private _handleRemoveWaypoint({ x, y }: Point) {
        const waypoints = this._waypoints();
        const [nearest, dist] = nearestPoint(waypoints, [x, y]);
        if (!nearest || dist > MAX_DIST) return;
        this._waypoints.set(waypoints.filter((p) => !isSamePoint(p, nearest)));
        const links = this._waypoints_links();
        this._waypoints_links.set(
            links.filter(
                ([p1, p2]) =>
                    !(isSamePoint(nearest, p1) || isSamePoint(nearest, p2)),
            ),
        );
    }

    private _handleLinkWaypoint({ x, y }: Point) {
        const waypoints = this._waypoints();
        const [nearest, dist] = nearestPoint(waypoints, [x, y]);
        if (!nearest || dist > MAX_DIST) return;
        if (!this._active_point()) {
            this._active_point.set(nearest);
        } else {
            const links = this._waypoints_links();
            if (
                isSamePoint(this._active_point(), nearest) ||
                linkExists(links, this._active_point(), nearest)
            ) {
                return this._active_point.set(nearest);
            }
            this._waypoints_links.set([
                ...links,
                [this._active_point(), nearest],
            ]);
            this._active_point.set(null);
        }
    }

    private _handleSetFeature({ x, y }: Point) {
        const waypoints = this._waypoints();
        const [nearest, dist] = nearestPoint(waypoints, [x, y]);
        if (!nearest || dist > MAX_DIST) return;
        nearest[2] = !nearest[2];
        this._waypoints.set([
            ...waypoints.filter((p) => !isSamePoint(p, nearest)),
            nearest,
        ]);
    }

    private _handleTestNavigation({ x, y }: Point) {
        if (!this._active_point()) {
            this._active_point.set([x, y, false]);
            this._navpath.set(null);
        } else {
            const waypoints = this._waypoints();
            const links = this._waypoints_links();
            const path = getPathBetweenPoints(
                waypoints,
                links,
                this._active_point(),
                [x, y, false],
            );
            this._navpath.set(path);
            this._active_point.set(null);
        }
    }
}

function nearestPoint(
    list: GridPoint[],
    [x, y]: [number, number],
): [GridPoint | null, number] {
    let distance = 100;
    let point = null;
    for (const p of list) {
        const [x2, y2] = p;
        const dx = x2 - x;
        const dy = y2 - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < distance) {
            point = p;
            distance = dist;
        }
    }
    return [point, distance];
}

function linkExists(
    list: [GridPoint, GridPoint][],
    p1: GridPoint,
    p2: GridPoint,
) {
    return !!list.find(
        ([lp1, lp2]) =>
            (isSamePoint(lp1, p1) || isSamePoint(lp1, p2)) &&
            (isSamePoint(lp2, p1) || isSamePoint(lp2, p2)),
    );
}

function isSamePoint([x1, y1]: GridPoint, [x2, y2]: GridPoint) {
    return x1 === x2 && y1 === y2;
}

function getPathBetweenPoints(
    points: GridPoint[],
    links: [GridPoint, GridPoint][],
    [sx, sy]: GridPoint,
    [ex, ey]: GridPoint,
): GridPoint[] {
    const [nearest_start] = nearestPoint(points, [sx, sy]);
    const [nearest_end] = nearestPoint(points, [ex, ey]);
    let path = findPath(links as any, nearest_start as any, nearest_end as any);
    const set = new Set<GridPoint>();
    set.add(nearest_start);
    for (const [p1, p2] of path) {
        set.add([p2[0], p2[1], false]);
    }
    return Array.from(set);
}
