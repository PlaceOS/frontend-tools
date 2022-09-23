import { Component, Inject } from '@angular/core';
import { MAP_FEATURE_DATA } from '@placeos-tools/components';
import { MapWaypointData } from './map-waypoint-display.component';

@Component({
    selector: `map-navpath-display`,
    template: `
        <div class="absolute inset-0">
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
                    [attr.stroke]="color"
                />
                <circle
                    *ngFor="let point of points"
                    class="pointer-events-auto"
                    [attr.cx]="point[0] * width"
                    [attr.cy]="point[1] * width * ratio"
                    [attr.r]="point[2] ? 6 : 4"
                    [attr.stroke-width]="point[2] ? 2 : 1"
                    [style.fill]="point[2] ? 'var(--primary)' : color"
                    [matTooltip]="point[0] + ', ' + point[1]"
                />
            </svg>
        </div>
    `,
    styles: [``],
})
export class MapNavPathDisplayComponent {
    public readonly points = this._details.points;
    public readonly links = this._details.links;
    public readonly color = this._details.color || '#000';
    public readonly ratio = this._details.ratio || 1;

    public width = 300;

    constructor(@Inject(MAP_FEATURE_DATA) private _details: MapWaypointData) {}
}
