import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { BaseClass, HashMap } from '@placeos-tools/common';
import { Observable } from 'rxjs';
import { MAP_FEATURE_DATA } from './interactive-map.component';

export interface MapPolygonData {
    /** Name of the region */
    name: string;
    /** Color to display region in on overlay */
    color: string;
    /** Array of points that define the shape of the region */
    points: [number, number][];
    /**  */
    ratio?: number;
    svg_ratio?: number;
    zoom_value?: number;
    ratio$?: Observable<number>;
    svg_ratio$?: Observable<number>;
    zoom$?: Observable<number>;
    data$?: Observable<MapPolygonData>;
}

@Component({
    selector: '[map-polygon]',
    template: `
        <div
            polygon
            class="w-full h-full"
            [style.transform]="'scale(' + scale + ')'"
        >
            <div
                class="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                [style.width]="width + '%'"
                [style.height]="height + '%'"
                [style.top]="center.y * 100 + '%'"
                [style.left]="center.x * 100 + '%'"
            >
                <svg
                    [attr.viewBox]="
                        '-4 -4 ' +
                        (this.width * 5 + 8) +
                        ' ' +
                        (this.height * ratio * 5 + 8)
                    "
                    preserveAspectRatio="none"
                    class="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                    [style.width]="'calc(100% + 16px)'"
                    [style.height]="'calc(100% + 16px)'"
                >
                    <polygon
                        [attr.points]="points"
                        [style.fill]="fill"
                        [style.stroke]="stroke"
                    />
                    <circle
                        *ngFor="let point of point_list"
                        [attr.cx]="point[0] || 0"
                        [attr.cy]="point[1] || 0"
                        [attr.r]="4"
                        [style.stroke]="'#000'"
                        [style.fill]="'#fffd'"
                    />
                </svg>
            </div>
        </div>
        <div
            class="absolute  -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
            [style.width]="100 * scale + '%'"
            [style.height]="100 * scale + '%'"
        >
            <div
                text
                class="absolute -translate-x-1/2 -translate-y-1/2 text-shadow text-white text-xl text-center whitespace-pre-line"
                [style.top]="center.y * 100 + '%'"
                [style.left]="center.x * 100 + '%'"
            >
                {{ name }}
            </div>
        </div>
    `,
    styles: [
        `
            :host {
                position: absolute;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
            }

            polygon {
                stroke-width: 2;
            }

            circle {
                stroke-width: 2;
            }

            [text] {
                width: 32rem;
                max-width: 65vw;
            }
        `,
    ],
})
export class MapPolygonComponent extends BaseClass implements OnInit {
    /** Message to display above the pin */
    public name = this._details.name;
    /** Fill colour for the pin SVG */
    public fill = `${this._details.color || '#e53935'}88`;
    /** Stroke colour for the pin SVG */
    public stroke = this._details.color || '#e53935';
    public padding = 32;
    public width = 1;
    public height = 1;
    public center = { x: 0, y: 0 };
    public readonly svg_scale = 20;

    public get scale() {
        return this._details.svg_ratio * this._details.zoom_value || 1;
    }

    public get ratio() {
        return Math.floor(this._details.svg_ratio * 100) / 100 || 1;
    }

    /** List of points for drawing the polygon */
    public points = `0,0 0,${this.height} ${this.width},${this.height} ${this.width},0`;

    public point_list: [number, number][] = [];

    constructor(
        @Inject(MAP_FEATURE_DATA) private _details: MapPolygonData,
        private _cdr: ChangeDetectorRef
    ) {
        super();
    }

    public ngOnInit(): void {
        if (this._details.data$) {
            this.subscription(
                'data',
                this._details.data$.subscribe(({ name, color, points }) => {
                    this.name = name;
                    this.fill = `${color || '#e53935'}88`;
                    this.stroke = color || '#e53935';
                    if (points.length) this._details.points = points;
                    this.processPoints();
                })
            );
        }
        this.subscription(
            'ratio',
            this._details.ratio$?.subscribe((_) => {
                this._details.ratio = _ || 1;
                this.processPoints();
            })
        );
        this.subscription(
            'zoom',
            this._details.zoom$?.subscribe((_) => {
                this._details.zoom_value = _ || 1;
                this.processPoints();
            })
        );
        this.subscription(
            'svg_ratio',
            this._details.svg_ratio$?.subscribe(
                (_) => (this._details.svg_ratio = _ || 1)
            )
        );
        this.processPoints();
    }

    public processPoints() {
        const { zoom_value, points } = this._details;
        if (!points?.length) return;
        const diff: HashMap<number> = points.reduce(
            (m, [x, y]) => ({
                x_min: x < m.x_min ? x : m.x_min,
                x_max: x > m.x_max ? x : m.x_max,
                y_min: y < m.y_min ? y : m.y_min,
                y_max: y > m.y_max ? y : m.y_max,
            }),
            {
                x_min: 100,
                x_max: -100,
                y_min: 100,
                y_max: -100,
            }
        );
        const range = {
            x: diff.x_max - diff.x_min,
            y: diff.y_max - diff.y_min,
        };
        this.center = {
            x: range.x / 2 + diff.x_min,
            y: range.y / 2 + diff.y_min,
        };
        this.width = range.x;
        this.height = range.y;
        this.width = Math.abs(Math.floor(this.width * 100) || 1);
        this.height = Math.abs(Math.floor(this.height * 100) || 1);
        this.points = points
            .reduce(
                (s, [x, y]) =>
                    `${s}${s ? ' ' : ''}${
                        ((x - diff.x_min) / range.x) * this.width * 5
                    },${
                        ((y - diff.y_min) / range.y) *
                        this.height *
                        this.ratio *
                        5
                    }`,
                ''
            )
            .replace(/NaN/g, '0');
        this.point_list = points.map(([x, y]) => [
            ((x - diff.x_min) / range.x) * this.width * 5,
            ((y - diff.y_min) / range.y) * this.height * this.ratio * 5,
        ]);
        this._cdr.detectChanges();
    }
}
