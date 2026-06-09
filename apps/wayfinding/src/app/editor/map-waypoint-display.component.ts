import { Component, computed, inject, signal } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { MAP_FEATURE_DATA } from '@placeos-tools/components';
import { GridPoint } from './editor-state.service';

export interface MapWaypointData {
    points: GridPoint[];
    links: [GridPoint, GridPoint][];
    active: GridPoint | null;
    ratio?: number;
    testing?: boolean;
    color?: string;
}

@Component({
    selector: `map-waypoint-display`,
    template: `
        <div class="absolute inset-0" [class.opacity-30]="testing()">
            <svg
                [attr.viewBox]="'0 0 ' + width() + ' ' + width() * ratio()"
                preserveAspectRatio="none"
                class="absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2"
            >
                @for (link of links(); track link) {
                    <line
                        [attr.x1]="link[0][0] * width()"
                        [attr.y1]="link[0][1] * width() * ratio()"
                        [attr.x2]="link[1][0] * width()"
                        [attr.y2]="link[1][1] * width() * ratio()"
                        stroke-width="2"
                        stroke="#000"
                    />
                }
                @for (point of points(); track point) {
                    <circle
                        class="pointer-events-auto"
                        [attr.cx]="point[0] * width()"
                        [attr.cy]="point[1] * width() * ratio()"
                        [attr.r]="point[2] ? 6 : 4"
                        [attr.stroke-width]="point[2] ? 2 : 1"
                        [attr.stroke]="point[2] ? '#fff' : '#000'"
                        [style.fill]="
                            isActive(point)
                                ? '#388e3c'
                                : point[2]
                                  ? 'var(--primary)'
                                  : '#fff'
                        "
                        [matTooltip]="point[0] + ', ' + point[1]"
                    />
                }
            </svg>
        </div>
    `,
    styles: [``],
    imports: [MatTooltip],
})
export class MapWaypointDisplayComponent {
    private readonly _details = signal(
        inject<MapWaypointData>(MAP_FEATURE_DATA),
    );

    public readonly points = computed(() => this._details().points);
    public readonly links = computed(() => this._details().links);
    public readonly active = computed(() => this._details().active);
    public readonly ratio = computed(() => this._details().ratio || 1);
    public readonly testing = computed(() => !!this._details().testing);

    public readonly width = signal(300);

    public isActive([x, y]: GridPoint) {
        if (!this.active()) return false;
        const [ax, ay] = this.active();
        return x === ax && y === ay;
    }
}
