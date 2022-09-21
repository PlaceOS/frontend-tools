import { Component, Inject } from '@angular/core';
import { MAP_FEATURE_DATA } from '@placeos-tools/components';
import { GridPoint } from './editor-state.service';

export interface MapWaypointData {
    points: GridPoint[];
    links: [GridPoint, GridPoint][];
    active: GridPoint | null;
    ratio?: number;
}

@Component({
    selector: `map-waypoint-display`,
    template: `
        <div class="absolute inset-0 bg-black/10">
            <svg
                [attr.viewBox]="'0 0 ' + width + ' ' + width * ratio"
                preserveAspectRatio="none"
                class="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-full h-full"
            >
                <line
                    *ngFor="let link of links"
                    [attr.x1]="link[0][0] * width"
                    [attr.y1]="link[0][1] * width * ratio"
                    [attr.x2]="link[1][0] * width"
                    [attr.y2]="link[1][1] * width * ratio"
                    stroke-width="2"
                    stroke="#000"
                />
                <circle
                    *ngFor="let point of points"
                    [attr.cx]="point[0] * width"
                    [attr.cy]="point[1] * width * ratio"
                    [attr.r]="point[2] ? 6 : 4"
                    [attr.stroke-width]="point[2] ? 2 : 1"
                    [attr.stroke]="point[2] ? '#fff' : '#000'"
                    [style.fill]="isActive(point) ? '#388e3c' : point[2] ? 'var(--primary)' : '#fff'"
                />
            </svg>
        </div>
    `,
    styles: [``],
})
export class MapWaypointDisplayComponent {
    public readonly points = this._details.points;
    public readonly links = this._details.links;
    public readonly active = this._details.active;
    public readonly ratio = this._details.ratio || 1;

    public width = 300;

    public isActive([x, y]: GridPoint) {
        if (!this.active) return false;
        const [ax, ay] = this.active;
        return x === ax && y === ay;
    }

    constructor(@Inject(MAP_FEATURE_DATA) private _details: MapWaypointData) {}
}
