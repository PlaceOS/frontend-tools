import {
    Component,
    ElementRef,
    OnInit,
    Signal,
    effect,
    inject,
    viewChild,
} from '@angular/core';
import { BaseClass } from '@placeos-tools/common';
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
    draw_labels?: boolean;
    draw_points?: boolean;
    polygons: Signal<Polygon[]>;
    ratio?: Signal<number>;
    svg_ratio?: Signal<number>;
    zoom?: Signal<number>;
    data?: Signal<MapPolygonData>;
}

@Component({
    selector: '[map-canvas]',
    template: `
        <canvas
            #canvas
            class="pointer-events-none absolute inset-0 h-full w-full"
        ></canvas>
    `,
    styles: [],
})
export class MapCanvasComponent extends BaseClass implements OnInit {
    private _data = inject<MapPolygonData>(MAP_FEATURE_DATA);

    public zoom = 1;
    public ratio = 1;
    public svg_ratio = 1;
    public width = 10000;

    private readonly canvas_element =
        viewChild<ElementRef<HTMLCanvasElement>>('canvas');

    constructor() {
        super();
        effect(() => {
            this._handleMapChange(
                this._data.ratio?.() ?? 1,
                this._data.zoom?.() ?? 1,
                this._data.svg_ratio?.() ?? 1,
            );
        });
        effect(() => this._handleStateChange(this._data.polygons()));
    }

    public get ratioed_height(): number {
        return +(this.width * this.ratio).toFixed(2);
    }

    public ngOnInit(): void {
        this._handleStateChange(this._data.polygons());
    }

    private async _handleMapChange(
        ratio: number,
        zoom: number,
        svg_ratio: number,
    ) {
        const old_ratio = this.ratio;
        this.zoom = zoom;
        this.ratio = ratio;
        this.svg_ratio = svg_ratio;
        const width = this.width / 10;
        const height = (this.width * this.ratio) / 10;
        const canvas = this.canvas_element()?.nativeElement;
        if (!canvas) return;

        if (
            old_ratio === ratio &&
            canvas.width === width &&
            canvas.height === height
        )
            return;

        canvas.width = width;
        canvas.height = height;

        this._handleStateChange(this._data.polygons());
    }

    private _handleStateChange(polygon_list: Polygon[]): void {
        const canvas = this.canvas_element()?.nativeElement;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        polygon_list.forEach((poly) => this._drawPolygon(poly));
    }

    private _drawPolygon(polygon: Polygon) {
        const points = polygon.points;
        if (!points?.length) return;
        const canvas = this.canvas_element()?.nativeElement;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
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
        if (this._data.draw_points !== false) {
            ctx.fillStyle = '#fff';
            ctx.strokeStyle = polygon.color;
            ctx.lineWidth = 4;
            points.forEach(([x, y]) => {
                ctx.beginPath();
                ctx.arc(x * width, y * height, 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            });
        }
        // Draw Text
        if (this._data.draw_labels !== false) {
            const center = points.reduce(
                (acc, [x, y]) => [acc[0] + x, acc[1] + y],
                [0, 0],
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
                center[1] * height + 2,
            );
            ctx.fillStyle = '#000';
            ctx.fillText(polygon.name, center[0] * width, center[1] * height);
        }
    }
}
