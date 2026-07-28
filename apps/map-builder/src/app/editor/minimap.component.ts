import {
    Component,
    ElementRef,
    computed,
    inject,
    input,
    signal,
    viewChild,
} from '@angular/core';

import { IconComponent } from '@placeos-tools/components';

import { MapObject } from '../data/types';
import { EditorStateService } from './editor-state.service';

const TYPE_COLORS: Record<string, string> = {
    room: '#3b82f6',
    desk: '#22c55e',
    zone: '#a855f7',
    area: '#f59e0b',
    amenity: '#06b6d4',
    decorative: '#6b7280',
    parking: '#8b5cf6',
    locker: '#ec4899',
};

const MINIMAP_WIDTH = 180;

@Component({
    selector: 'map-builder-minimap',
    template: `
        @if (collapsed()) {
            <button
                class="bg-base-100 border-base-300 text-base-content/60 absolute right-3 bottom-3 z-20 rounded border px-2 py-1 text-xs font-semibold shadow"
                (click)="collapsed.set(false)"
            >
                Map
            </button>
        } @else {
            <div
                #frame
                class="border-base-300 bg-base-200 absolute right-3 bottom-3 z-20 cursor-crosshair overflow-hidden rounded-lg border shadow-md"
                [style.width.px]="minimapWidth"
                [style.height.px]="minimapHeight()"
                (click)="navigate($event)"
                (keyup.enter)="collapsed.set(true)"
                tabindex="0"
                role="button"
            >
                <button
                    class="text-base-content/40 hover:text-base-content absolute top-0.5 right-0.5 z-10 text-sm"
                    title="Hide minimap"
                    (click)="hide($event)"
                >
                    <app-icon>close</app-icon>
                </button>
                <svg
                    [attr.width]="minimapWidth"
                    [attr.height]="minimapHeight()"
                    [attr.viewBox]="
                        '0 0 ' +
                        state.canvas_width() +
                        ' ' +
                        state.canvas_height()
                    "
                >
                    @if (state.image_url(); as href) {
                        <image
                            [attr.href]="href"
                            x="0"
                            y="0"
                            [attr.width]="state.canvas_width()"
                            [attr.height]="state.canvas_height()"
                            opacity="0.7"
                        />
                    }
                    @for (object of state.visible_objects(); track object.id) {
                        @switch (object.geometry.type) {
                            @case ('rect') {
                                <rect
                                    [attr.x]="object.geometry.x ?? 0"
                                    [attr.y]="object.geometry.y ?? 0"
                                    [attr.width]="object.geometry.width ?? 10"
                                    [attr.height]="object.geometry.height ?? 10"
                                    [attr.fill]="colorFor(object)"
                                    opacity="0.75"
                                />
                            }
                            @case ('circle') {
                                <circle
                                    [attr.cx]="object.geometry.x ?? 0"
                                    [attr.cy]="object.geometry.y ?? 0"
                                    [attr.r]="object.geometry.r ?? 5"
                                    [attr.fill]="colorFor(object)"
                                    opacity="0.6"
                                />
                            }
                            @case ('polygon') {
                                <polygon
                                    [attr.points]="pointsOf(object)"
                                    [attr.fill]="colorFor(object)"
                                    opacity="0.6"
                                />
                            }
                        }
                    }
                    <rect
                        [attr.x]="viewport().x"
                        [attr.y]="viewport().y"
                        [attr.width]="viewport().w"
                        [attr.height]="viewport().h"
                        fill="rgba(59,130,246,0.1)"
                        stroke="#3b82f6"
                        [attr.stroke-width]="viewportStroke()"
                        rx="2"
                    />
                </svg>
            </div>
        }
    `,
    imports: [IconComponent],
})
export class MinimapComponent {
    public readonly state = inject(EditorStateService);

    /** The editor's scrolling canvas container */
    public readonly container = input.required<HTMLElement>();

    private readonly _frame = viewChild<ElementRef<HTMLDivElement>>('frame');

    public readonly collapsed = signal(false);
    public readonly minimapWidth = MINIMAP_WIDTH;

    /** Bumped on scroll/resize so the viewport box recomputes */
    private readonly _tick = signal(0);

    public readonly minimapHeight = computed(() =>
        Math.round(
            MINIMAP_WIDTH *
                (this.state.canvas_height() / this.state.canvas_width()),
        ),
    );

    public readonly viewportStroke = computed(() =>
        Math.max((this.state.canvas_width() / MINIMAP_WIDTH) * 1.5, 3),
    );

    /** Portion of the canvas currently on screen, in canvas units */
    public readonly viewport = computed(() => {
        this._tick();
        const element = this.container();
        const width = this.state.canvas_width();
        const height = this.state.canvas_height();
        const zoom = this.state.zoom();
        if (!element) return { x: 0, y: 0, w: width, h: height };
        const displayW = width * zoom;
        const displayH = height * zoom;
        return {
            x: (element.scrollLeft / displayW) * width,
            y: (element.scrollTop / displayH) * height,
            w: Math.min((element.clientWidth / displayW) * width, width),
            h: Math.min((element.clientHeight / displayH) * height, height),
        };
    });

    public readonly colorFor = (object: MapObject) =>
        TYPE_COLORS[object.object_type] ?? '#94a3b8';

    public readonly pointsOf = (object: MapObject) =>
        (object.geometry.points ?? []).map((p) => `${p.x},${p.y}`).join(' ');

    constructor() {
        const refresh = () => this._tick.update((n) => n + 1);
        // The container is an input, so wait a tick before subscribing
        queueMicrotask(() => {
            this.container()?.addEventListener('scroll', refresh, {
                passive: true,
            });
            window.addEventListener('resize', refresh);
        });
    }

    public hide(event: Event) {
        event.stopPropagation();
        this.collapsed.set(true);
    }

    /** Scrolls the canvas so the clicked point sits in the middle */
    public navigate(event: MouseEvent) {
        const element = this.container();
        const frame = this._frame()?.nativeElement;
        if (!element || !frame) return;
        const rect = frame.getBoundingClientRect();
        const width = this.state.canvas_width();
        const height = this.state.canvas_height();
        const zoom = this.state.zoom();
        const mx = ((event.clientX - rect.left) / MINIMAP_WIDTH) * width;
        const my = ((event.clientY - rect.top) / this.minimapHeight()) * height;
        element.scrollTo({
            left: (mx / width) * width * zoom - element.clientWidth / 2,
            top: (my / height) * height * zoom - element.clientHeight / 2,
            behavior: 'smooth',
        });
    }
}
