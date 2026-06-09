import { CommonModule } from '@angular/common';
import {
    Component,
    effect,
    ElementRef,
    inject,
    Injector,
    input,
    model,
    OnDestroy,
    OnInit,
    output,
    signal,
    TemplateRef,
    Type,
    viewChild,
    viewChildren,
} from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
    MAP_FEATURE_DATA,
    ViewAction,
    ViewerFeature,
    ViewerLabel,
    ViewerStyles,
} from './map-types';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    MapAction,
    MapDetails,
    MapOverlay,
    MapViewChangeEvent,
    MapViewer,
    Vec2,
} from './map-viewer.class';

export interface MapOptions {
    disable_zoom?: boolean;
    disable_zoon?: boolean;
    disable_pan?: boolean;
    controls?: boolean;
}

export interface MapMetadata {
    styles?: ViewerStyles;
    features?: ViewerFeature[];
    labels?: ViewerLabel[];
    actions?: ViewAction[];
}

@Component({
    selector: 'dynamic-map,i-map,interactive-map',
    template: `
        <div #mapContainer map-container></div>
        <ng-content />
        @if (options()?.controls) {
            <div
                zoom
            >
                <button
                    icon
                    matRipple
                    matTooltip="Zoom in"
                    matTooltipPosition="left"
                    (click)="setZoom(zoom() * 1.1); $event.stopPropagation()"
                >
                    <span class="material-symbols-outlined">add</span>
                </button>
                <button
                    icon
                    matRipple
                    matTooltip="Zoom out"
                    matTooltipPosition="left"
                    (click)="
                        setZoom(zoom() * (10 / 11)); $event.stopPropagation()
                    "
                >
                    <span class="material-symbols-outlined">remove</span>
                </button>
                <button
                    icon
                    matRipple
                    matTooltip="Reset zoom"
                    matTooltipPosition="left"
                    (click)="resetView(); $event.stopPropagation()"
                >
                    <span class="material-symbols-outlined">refresh</span>
                </button>
            </div>
        }
        @if (injectors?.length) {
            <div hidden>
                @for (
                    element of features();
                    track $any(element).track_id || $index;
                    let i = $index
                ) {
                    @if (element) {
                        <div>
                            <div
                                #feature
                                class="z-20 h-full w-full"
                                [attr.el-id]="element.location"
                                [attr.track-id]="$any(element).track_id"
                            >
                                @switch (contentType(element.content)) {
                                    @case ('component') {
                                        <ng-container
                                            *ngComponentOutlet="
                                                $any(element.content);
                                                injector: injectors[i]
                                            "
                                        ></ng-container>
                                    }
                                    @case ('html') {
                                        <div
                                            [innerHTML]="
                                                element.content
                                            "
                                        ></div>
                                    }
                                    @default {
                                        <ng-container
                                            *ngTemplateOutlet="
                                                $any(element.content);
                                                context: $any(element).data
                                            "
                                        ></ng-container>
                                    }
                                }
                            </div>
                        </div>
                    }
                }
            </div>
        }
    `,
    styles: [
        `
            :host {
                display: block;
                position: relative;
                width: 100%;
                height: 100%;
            }

            [map-container] {
                position: absolute;
                inset: 0;
                z-index: 0;
                overflow: hidden;
            }

            [zoom] {
                position: absolute;
                right: 0.25rem;
                bottom: 4rem;
                z-index: 40;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                border: 1px solid var(--b2, #ddd);
                border-radius: 2px;
                background: var(--b1, #fff);
                color: var(--bc, #000);
                box-shadow: 0 1px 3px rgb(0 0 0 / 0.2);
            }

            [zoom] button {
                border-radius: 0;
                border: 0;
                border-bottom: 1px solid var(--b2, #ddd);
                background: transparent;
            }

            [zoom] button:last-child {
                border-bottom: 0;
            }

            [zoom] .material-symbols-outlined {
                font-size: 1.5rem;
                line-height: 1;
            }
        `,
    ],
    imports: [CommonModule, MatRippleModule, MatTooltipModule],
})
export class DynamicMapComponent implements OnInit, OnDestroy {
    private _injector = inject(Injector);
    private _map_viewer: MapViewer | null = null;
    private _map_container =
        viewChild<ElementRef<HTMLDivElement>>('mapContainer');
    private _feature_elements = viewChildren<ElementRef<HTMLDivElement>>(
        'feature',
        {}
    );

    public src = input('');
    public zoom = model(1);
    public center = model<Vec2>({ x: 0, y: 0 });
    public reset = model(0);
    public metadata = model({} as MapMetadata);
    public styles = input<ViewerStyles>({});
    public features = input<ViewerFeature[]>([]);
    public labels = input<ViewerLabel[]>([]);
    public actions = input<ViewAction[]>([]);
    public options = input({} as MapOptions);
    public focus = input('');
    public mapInfo = output<MapDetails>();
    public aspect_ratio = output<number>();

    public injectors: Injector[] = [];
    public loading = signal(false);

    private _view_changes = new BehaviorSubject<{
        zoom: number;
        center: Vec2;
        ratio: number;
        svg_ratio: number;
    }>({ zoom: 1, center: { x: 0, y: 0 }, ratio: 1, svg_ratio: 1 });
    /** Flag to prevent feedback loop when syncing view changes */
    private _syncing_from_viewer = false;

    private _extra_data = {
        ratio$: this._view_changes.pipe(map((_) => _.ratio)),
        svg_ratio$: this._view_changes.pipe(map((_) => _.svg_ratio)),
        zoom$: this._view_changes.pipe(map((_) => _.zoom)),
        center$: this._view_changes.pipe(map((_) => _.center)),
        position: this._view_changes.pipe(map((_) => _.center)),
    };

    constructor() {
        // Effect to load map when src changes
        effect(() => {
            const src = this.src();
            if (src && this._map_viewer) {
                this._setMap(src);
            }
        });

        // Effect to update styles when styles or metadata changes
        effect(() => {
            const styles = this.styles() || this.metadata()?.styles || {};
            if (this._map_viewer && Object.keys(styles).length > 0) {
                this._applyStyles(styles);
            }
        });

        // Effect to update overlays when features or labels change
        effect(() => {
            const features = this.features() || this.metadata()?.features || [];
            const labels = this.labels() || this.metadata()?.labels || [];
            // Read feature elements to create dependency
            const feature_elements = this._feature_elements();
            if (this._map_viewer) {
                this._applyOverlays(features, labels, feature_elements);
            }
        });

        // Keep feature injectors aligned with the signal-based input.
        effect(() => {
            this.features();
            this._updateInjectors();
        });

        // Effect to update actions when actions or metadata changes
        effect(() => {
            const actions = this.actions() || this.metadata()?.actions || [];
            if (this._map_viewer) {
                this._applyActions(actions);
            }
        });

        effect(() => {
            const options = this.options() || {};
            if (this._map_viewer) {
                this._map_viewer.setInteractionOptions({
                    disable_pan: !!options.disable_pan,
                    disable_zoom: !!(
                        options.disable_zoom || options.disable_zoon
                    ),
                });
            }
        });

        // Effect to sync zoom to MapViewer
        effect(() => {
            const zoom_val = this.zoom() ?? 1;
            if (this._map_viewer && !this._syncing_from_viewer) {
                this._map_viewer.setZoom(zoom_val);
            }
        });

        // Effect to sync center to MapViewer
        effect(() => {
            const center_val = this.center();
            if (this._map_viewer && !this._syncing_from_viewer) {
                this._map_viewer.setCenter(
                    center_val ? { ...center_val } : { x: 0, y: 0 }
                );
            }
        });

        // Effect to handle reset
        effect(() => {
            const reset_val = this.reset();
            if (reset_val > 0 && this._map_viewer) {
                this._syncing_from_viewer = true;
                this.zoom.set(1);
                this.center.set({ x: 0, y: 0 });
                this._map_viewer.setZoom(1);
                this._map_viewer.setCenter({ x: 0, y: 0 });
                this._syncing_from_viewer = false;
            }
        });

        // Effect to update view changes observable
        effect(() => {
            const zoom_val = this.zoom() ?? 1;
            const center_val = this.center() ?? { x: 0, y: 0 };
            this._view_changes.next({
                zoom: zoom_val,
                center: center_val,
                ratio: this._view_changes.value.ratio,
                svg_ratio: this._view_changes.value.svg_ratio,
            });
        });
    }

    public ngOnInit() {
        const container = this._map_container()?.nativeElement;
        if (container) {
            this._map_viewer = new MapViewer(container);

            // Set up callback to sync view changes from user interaction
            this._map_viewer.onViewChange = (event: MapViewChangeEvent) => {
                this._syncing_from_viewer = true;
                this.zoom.set(event.zoom);
                this.center.set(event.center);
                this._syncing_from_viewer = false;
            };

            // Apply initial view state (use defaults if values are undefined)
            const options = this.options() || {};
            this._map_viewer.setInteractionOptions({
                disable_pan: !!options.disable_pan,
                disable_zoom: !!(options.disable_zoom || options.disable_zoon),
            });
            this._map_viewer.setZoom(this.zoom() ?? 1);
            this._map_viewer.setCenter(
                this.center() ? { ...this.center() } : { x: 0, y: 0 }
            );

            const src = this.src();
            if (src) {
                this._setMap(src);
            }
        }
    }

    public ngOnDestroy() {
        if (this._map_viewer) {
            this._map_viewer.destroy();
            this._map_viewer = null;
        }
    }

    public setZoom(value: number) {
        this.zoom.set(value);
        this._map_viewer?.setZoom(value);
    }

    public resetView() {
        this.reset.set(this.reset() + 1);
        this.zoom.set(1);
        this.center.set({ x: 0, y: 0 });
        this._map_viewer?.setZoom(1);
        this._map_viewer?.setCenter({ x: 0, y: 0 });
    }

    /**
     * Determine the type of content for rendering in template
     */
    public contentType(
        content: string | HTMLElement | TemplateRef<any> | Type<any>
    ): 'html' | 'element' | 'template' | 'component' {
        return typeof content === 'string'
            ? 'html'
            : content instanceof HTMLElement
            ? 'element'
            : content instanceof TemplateRef
            ? 'template'
            : 'component';
    }

    private _applyStyles(styles: ViewerStyles) {
        if (!this._map_viewer) return;

        // Convert ViewerStyles to Map<string, CSSStyleDeclaration>
        const style_map = new Map<string, CSSStyleDeclaration>();
        for (const [id, style_obj] of Object.entries(styles)) {
            // Create a minimal CSSStyleDeclaration-like object
            const css_style = {
                cssText: this._objectToCssText(style_obj),
            } as CSSStyleDeclaration;
            style_map.set(id, css_style);
        }

        this._map_viewer.setStyles(style_map);
    }

    private _objectToCssText(
        style_obj: Record<string, string | number>
    ): string {
        return Object.entries(style_obj)
            .map(([prop, value]) => {
                // Convert camelCase to kebab-case
                const kebab_prop = prop.replace(
                    /[A-Z]/g,
                    (match) => `-${match.toLowerCase()}`
                );
                return `${kebab_prop}: ${value}`;
            })
            .join('; ');
    }

    private async _setMap(src: string) {
        if (!this._map_viewer) return;
        this.loading.set(true);
        try {
            const map = await this._map_viewer.setMap(src);
            this._view_changes.next({
                ...this._view_changes.value,
                ratio: map.aspect_ratio ? 1 / map.aspect_ratio : 1,
                svg_ratio: 1,
            });
            this.aspect_ratio.emit(map.aspect_ratio);
            this.mapInfo.emit(map);
        } finally {
            this.loading.set(false);
        }
    }

    private _applyOverlays(
        features: ViewerFeature[],
        labels: ViewerLabel[],
        feature_elements: readonly ElementRef<HTMLDivElement>[]
    ) {
        if (!this._map_viewer) return;

        const overlays: MapOverlay[] = [];

        // Convert features to overlays
        for (let i = 0; i < features.length; i++) {
            const feature = features[i];
            if (!feature.location) continue;

            // Get the content element
            let contents: HTMLElement | string;
            const content_type = this.contentType(feature.content);

            if (content_type === 'component' || content_type === 'template') {
                // Use the rendered element from the hidden container
                const rendered_el = feature_elements[i]?.nativeElement;
                if (!rendered_el) continue;
                contents = rendered_el;
            } else if (feature.content instanceof HTMLElement) {
                contents = feature.content;
            } else if (typeof feature.content === 'string') {
                contents = feature.content;
            } else {
                continue;
            }

            overlays.push({
                ref: feature.full_size ? 'map-viewer-root' : feature.location,
                type:
                    feature.full_size || typeof feature.location === 'string'
                        ? 'box'
                        : 'point',
                contents,
                scale_with_zoom: false,
                box_scale: 1,
            });
        }

        // Convert labels to overlays
        for (const label of labels) {
            if (!label.location || !label.content) continue;

            overlays.push({
                ref: label.location,
                type: 'point',
                contents: label.content,
                scale_with_zoom: true,
            });
        }

        this._map_viewer.setOverlays(overlays);
    }

    private _applyActions(actions: ViewAction[]) {
        if (!this._map_viewer) return;

        const map_actions: MapAction[] = [];

        for (const action of actions) {
            if (!action.id) continue;

            // Convert ViewAction action types to DOM event names
            const events = this._convertActionTypes(action.action);
            if (events.length === 0) continue;

            // Wrap the callback to adapt the signature
            // ViewAction callback: (e: Event, p?: Point) => void
            // MapAction callback: (p: Vec2) => void
            const callback = (p: Vec2) => {
                // Create a minimal synthetic event for compatibility
                const synthetic_event = new CustomEvent('mapaction', {
                    detail: { point: p },
                });
                action.callback(synthetic_event, { x: p.x, y: p.y });
            };

            map_actions.push({
                ref: action.id,
                events,
                callback,
            });
        }

        this._map_viewer.setActions(map_actions);
    }

    private _convertActionTypes(action_types: string | string[]): string[] {
        const types = Array.isArray(action_types)
            ? action_types
            : [action_types];
        const events: string[] = [];

        for (const type of types) {
            switch (type) {
                case 'click':
                    events.push('click');
                    break;
                case 'mousedown':
                case 'touchstart':
                    events.push('pointerdown');
                    break;
                case 'mousemove':
                case 'touchmove':
                    events.push('pointermove');
                    break;
                case 'mouseup':
                case 'touchend':
                    events.push('pointerup');
                    break;
                case 'enter':
                    events.push('pointerenter');
                    break;
                case 'leave':
                    events.push('pointerleave');
                    break;
                case '*':
                    events.push(
                        'click',
                        'pointerdown',
                        'pointerup',
                        'pointerenter',
                        'pointerleave'
                    );
                    break;
                default:
                    // Pass through unknown event types as-is
                    events.push(type);
            }
        }

        // Remove duplicates
        return [...new Set(events)];
    }

    private _updateInjectors() {
        const old_injectors = this.injectors || [];
        this.injectors = (this.features() || []).map(
            (f: any) =>
                old_injectors.find(
                    (_) =>
                        _.get(MAP_FEATURE_DATA)?.track_id &&
                        _.get(MAP_FEATURE_DATA)?.track_id === f.track_id
                ) ||
                Injector.create({
                    providers: [
                        {
                            provide: MAP_FEATURE_DATA,
                            useValue: {
                                track_id: f.track_id,
                                ...f.data,
                                ...this._extra_data,
                            },
                        },
                    ],
                    parent: this._injector,
                })
        );
    }
}
