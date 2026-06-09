import {
    Component,
    ElementRef,
    OnInit,
    inject,
    signal,
    viewChild,
} from '@angular/core';
import { BaseClass } from '@placeos-tools/common';
import { Observable, combineLatest } from 'rxjs';
import { MAP_FEATURE_DATA } from './map-viewer/map-types';

export interface Polygon {
    /** Name of the region */
    name: string;
    /** Color to display region in on overlay */
    color: string;
    /** List of x, y coordinates from 0 to 1 */
    points: [number, number][];
}

export interface MapPolygonData {
    polygon: Polygon;
    ratio$?: Observable<number>;
    svg_ratio$?: Observable<number>;
    zoom$?: Observable<number>;
    data$?: Observable<MapPolygonData>;
}

@Component({
    selector: '[map-polygon]',
    template: `
        <canvas
            #canvas
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            [style.width]="width() * svg_ratio() * zoom() + '%'"
            [style.height]="height() * ratio() * svg_ratio() * zoom() + '%'"
        ></canvas>
    `,
    styles: [],
})
export class MapPolygonComponent extends BaseClass implements OnInit {
    private _data = inject<MapPolygonData>(MAP_FEATURE_DATA);

    public readonly polygon = signal<Polygon>(this._data.polygon);
    public readonly zoom = signal(1);
    public readonly ratio = signal(1);
    public readonly svg_ratio = signal(1);
    public readonly width = signal(10000);
    public readonly height = signal(10000);

    private readonly canvas_element =
        viewChild<ElementRef<HTMLCanvasElement>>('canvas');

    public get ratioed_height(): number {
        return +(this.height() * this.ratio()).toFixed(2);
    }

    public ngOnInit(): void {
        this._handleStateChange(1, 1, 1);
        this.subscription(
            'state',
            combineLatest([
                this._data.ratio$,
                this._data.zoom$,
                this._data.svg_ratio$,
            ]).subscribe(([ratio, zoom, sr]) =>
                this._handleStateChange(ratio, zoom, sr)
            )
        );
    }

    private _handleStateChange(ratio: number, zoom: number, svg_ratio): void {
        const polygon = this.polygon();
        const points = polygon.points;
        this.zoom.set(zoom);
        this.ratio.set(ratio);
        this.svg_ratio.set(svg_ratio);
        if (!points?.length) return;
        const width = this.width() / 10;
        const height = (this.height() * this.ratio()) / 10;
        //
        const canvas = this.canvas_element().nativeElement;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, width, height);
        // Draw polygon
        ctx.fillStyle = polygon.color + '80';
        ctx.beginPath();
        ctx.moveTo(points[0][0] * width, points[0][1] * height);
        points.forEach(([x, y]) => ctx.lineTo(x * width, y * height));
        ctx.closePath();
        ctx.fill();
        // Draw Outline
        ctx.strokeStyle = polygon.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(points[0][0] * width, points[0][1] * height);
        points.forEach(([x, y]) => ctx.lineTo(x * width, y * height));
        ctx.closePath();
        ctx.stroke();
        // Draw Points
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = polygon.color;
        ctx.lineWidth = 4;
        points.forEach(([x, y]) => {
            ctx.beginPath();
            ctx.arc(x * width, y * height, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });
        // Draw Text
        const center = points.reduce(
            (acc, [x, y]) => [acc[0] + x, acc[1] + y],
            [0, 0]
        );
        center[0] /= points.length;
        center[1] /= points.length;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#FFF';
        ctx.font = '32px sans-serif';
        ctx.fillText(
            polygon.name,
            center[0] * width + 1,
            center[1] * height + 2
        );
        ctx.fillStyle = '#000';
        ctx.fillText(polygon.name, center[0] * width, center[1] * height);
    }
}
