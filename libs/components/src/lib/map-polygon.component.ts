import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { BaseClass } from '@placeos-tools/common';
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

    data$?: Observable<MapPolygonData>;
}

@Component({
    selector: '[map-polygon]',
    template: `
        <div
            polygon
            class="absolute"
            [style.width]="width * 100 + '%'"
            [style.height]="height * 100 + '%'"
            [style.transform]="'translate(' + offset_x + '%, ' + offset_y + '%)'"
        >
            <svg [attr.viewBox]="'0 0 ' + width + ' ' + height">
                <polygon
                    [attr.points]="points"
                    [style.fill]="fill"
                    [style.stroke]="stroke"
                />
            </svg>
            <div
                class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-shadow text-white text-xl"
            >
                {{ name }}
            </div>
        </div>
    `,
    styles: [
        `
            polygon {
                stroke-width: 1;
            }

            svg {
                width: 100%;
                height: 100%;
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

    public offset_x = 0;

    public offset_y = 0;

    public width =
        Math.abs(this._details.points[2][0] - this._details.points[0][0]) * 100;

    public height =
        Math.abs(this._details.points[2][1] - this._details.points[0][1]) *
        100 *
        (this._details?.ratio || 1);

    /** List of points for drawing the polygon */
    public points = `0,0 0,${this.height} ${this.width},${this.height} ${this.width},0`;

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
                this._details.data$.subscribe((_) => {
                    this.name = _.name;
                    this.fill = `${_.color || '#e53935'}88`;
                    this.stroke = _.color || '#e53935';
                    this.offset_x = ((_.points[2][0] - _.points[0][0]) < 0 ? -1 : 0) * 100;
                    this.offset_y = ((_.points[2][1] - _.points[0][1]) < 0 ? -1 : 0) * 100;
                    this.width =
                        Math.abs(_.points[2][0] - _.points[0][0]) * 100;
                    this.height =
                        Math.abs(_.points[2][1] - _.points[0][1]) *
                        100 *
                        (this._details?.ratio || 1);
                    this.width = Math.floor(this.width * 100) / 100;
                    this.height = Math.floor(this.height * 100) / 100;
                    this.points = `0,0 0,${this.height} ${this.width},${this.height} ${this.width},0`;
                    this._cdr.detectChanges();
                })
            );
        }
    }
}
