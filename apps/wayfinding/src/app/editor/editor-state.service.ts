import { Clipboard } from '@angular/cdk/clipboard';
import { Injectable } from '@angular/core';
import {
    downloadFile,
    isChildFrame,
    retrieveData,
    sendMessage,
} from '@placeos-tools/common';
import { getViewerByURL, Point } from '@placeos/svg-viewer';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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
    private _map_url = new BehaviorSubject<string>('');
    private _embeded = new BehaviorSubject<boolean>(false);
    private _method = new BehaviorSubject<ActionMethod>('add');
    private _active_point = new BehaviorSubject<GridPoint>(null);

    private _grid_size = new BehaviorSubject<[number, number]>([1000, 50]);
    private _navpath = new BehaviorSubject<GridPoint[]>([]);
    private _waypoints = new BehaviorSubject<GridPoint[]>([]);
    private _waypoints_links = new BehaviorSubject<[GridPoint, GridPoint][]>(
        []
    );
    /** List of features to be displayed on the map */
    public readonly features = combineLatest([
        this._waypoints,
        this._active_point,
        this._waypoints_links,
        this._navpath,
        this._method,
    ]).pipe(
        switchMap(async ([points, active, links, path_points, method]) => {
            const viewer = await getViewerByURL(this._map_url.getValue());
            const list: any[] = [
                {
                    location: 'svg-viewer-root',
                    content: MapWaypointDisplayComponent,
                    full_size: true,
                    no_scale: true,
                    data: {
                        points,
                        links,
                        active,
                        ratio: viewer?.ratio,
                        testing: method === 'testing',
                    },
                },
            ];
            if (method === 'testing' && (active || path_points)) {
                const points: GridPoint[] = path_points
                    ? path_points
                    : [[active[0], active[1], true]];
                const nav_links = [];
                for (let i = 1; i < points.length; i++) {
                    const link = links.find(
                        ([p1, p2]) =>
                            (isSamePoint(p1, points[i - 1]) &&
                                isSamePoint(p2, points[i])) ||
                            (isSamePoint(p2, points[i - 1]) &&
                                isSamePoint(p1, points[i]))
                    );
                    if (link) nav_links.push(link);
                }
                list.push({
                    location: 'svg-viewer-root',
                    content: MapNavPathDisplayComponent,
                    full_size: true,
                    no_scale: true,
                    data: {
                        points,
                        links: nav_links,
                        ratio: viewer?.ratio,
                        color: '#1976d2',
                    },
                });
                console.log(list);
            }
            return list;
        })
    );
    /** URL of the map to be displayed */
    public readonly url = this._map_url.asObservable();

    public readonly actions = [
        { id: '*', action: 'click', callback: (_, p) => this._handleClick(p) },
        {
            id: '*',
            action: 'touchend',
            callback: (_, p) => this._handleClick(p),
        },
    ];
    /** Whether application is embeded within another */
    public readonly embeded = this._embeded.asObservable();
    /** Size parameters for wayfinding grid */
    public readonly size = this._grid_size.asObservable();
    /** Action method for wayfinding grid */
    public readonly method = this._method.asObservable();

    constructor(private _clipboard: Clipboard) {
        const is_child = isChildFrame();
        this._embeded.next(is_child);
    }

    /** Update the map URL */
    public setURL(url: string) {
        this._map_url.next(url);
        setTimeout(
            () => this._waypoints.next(this._waypoints.getValue()),
            1000
        );
    }

    public setMethod(method: ActionMethod) {
        this._method.next(method);
        this._active_point.next(null);
        this._navpath.next(null);
    }

    public toMetadataObject() {
        return {
            size: this._grid_size.getValue(),
            points: this._waypoints.getValue(),
            links: this._waypoints_links.getValue(),
        };
    }

    public async saveMetadata() {
        const embeded = this._embeded.getValue();
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
                JSON.stringify(this.toMetadataObject())
            );
        }
    }

    public copyMetadata() {
        this._clipboard.copy(JSON.stringify(this.toMetadataObject(), null, 4));
    }

    public async loadWayfindingGrid() {
        if (!this._embeded.getValue()) return;
        const { size, points, links } = await retrieveData('wayfinding-grid');
        console.log('Loaded data:', size, points, links);
        this._waypoints.next(points);
        this._waypoints_links.next(links);
        this._grid_size.next(size);
    }

    private _handleClick(point: Point) {
        const x = Math.round(point.x * (1 / RES)) / (1 / RES);
        const y = Math.round(point.y * (1 / RES)) / (1 / RES);
        const method = this._method.getValue();
        if (method === 'add') this._handleAddWaypoint({ x, y });
        else if (method === 'remove') this._handleRemoveWaypoint({ x, y });
        else if (method === 'link') this._handleLinkWaypoint({ x, y });
        else if (method === 'set-feature') this._handleSetFeature({ x, y });
        else if (method === 'testing') this._handleTestNavigation({ x, y });
    }

    private _handleAddWaypoint({ x, y }: Point) {
        const waypoints = this._waypoints.getValue();
        const [nearest, dist] = nearestPoint(waypoints, [x, y]);
        if (nearest && dist < MAX_DIST) return;
        this._waypoints.next([...waypoints, [x, y, false]]);
    }

    private _handleRemoveWaypoint({ x, y }: Point) {
        const waypoints = this._waypoints.getValue();
        const [nearest, dist] = nearestPoint(waypoints, [x, y]);
        if (!nearest || dist > MAX_DIST) return;
        this._waypoints.next(waypoints.filter((p) => !isSamePoint(p, nearest)));
        const links = this._waypoints_links.getValue();
        this._waypoints_links.next(
            links.filter(
                ([p1, p2]) =>
                    !(isSamePoint(nearest, p1) || isSamePoint(nearest, p2))
            )
        );
    }

    private _handleLinkWaypoint({ x, y }: Point) {
        const waypoints = this._waypoints.getValue();
        const [nearest, dist] = nearestPoint(waypoints, [x, y]);
        if (!nearest || dist > MAX_DIST) return;
        if (!this._active_point.getValue()) {
            this._active_point.next(nearest);
        } else {
            const links = this._waypoints_links.getValue();
            if (
                isSamePoint(this._active_point.getValue(), nearest) ||
                linkExists(links, this._active_point.getValue(), nearest)
            ) {
                return this._active_point.next(nearest);
            }
            this._waypoints_links.next([
                ...links,
                [this._active_point.getValue(), nearest],
            ]);
            this._active_point.next(null);
        }
    }

    private _handleSetFeature({ x, y }: Point) {
        const waypoints = this._waypoints.getValue();
        const [nearest, dist] = nearestPoint(waypoints, [x, y]);
        if (!nearest || dist > MAX_DIST) return;
        nearest[2] = !nearest[2];
        this._waypoints.next([
            ...waypoints.filter((p) => !isSamePoint(p, nearest)),
            nearest,
        ]);
    }

    private _handleTestNavigation({ x, y }: Point) {
        if (!this._active_point.getValue()) {
            this._active_point.next([x, y, false]);
        } else {
            const waypoints = this._waypoints.getValue();
            const links = this._waypoints_links.getValue();
            const path = getPathBetweenPoints(
                waypoints,
                links,
                [x, y, false],
                this._active_point.getValue()
            );
            this._navpath.next(path);
            this._active_point.next(null);
        }
    }
}

function nearestPoint(
    list: GridPoint[],
    [x, y]: [number, number]
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
    p2: GridPoint
) {
    return !!list.find(
        ([lp1, lp2]) =>
            (isSamePoint(lp1, p1) || isSamePoint(lp1, p2)) &&
            (isSamePoint(lp2, p1) || isSamePoint(lp2, p2))
    );
}

function isSamePoint([x1, y1]: GridPoint, [x2, y2]: GridPoint) {
    return x1 === x2 && y1 === y2;
}

function getPathBetweenPoints(
    points: GridPoint[],
    links: [GridPoint, GridPoint][],
    [sx, sy]: GridPoint,
    [ex, ey]: GridPoint
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
