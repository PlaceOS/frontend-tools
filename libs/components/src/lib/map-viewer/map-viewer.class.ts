import { randomString } from '@placeos-tools/common';

export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Vec2 {
    x: number;
    y: number;
}

export interface MapDetails {
    raw_data: string;
    element_bounds: Map<string, Rect>;
    aspect_ratio: number;
    loaded_at: number;
}

export interface MapOverlay {
    ref: string | Vec2;
    type: 'point' | 'box';
    contents: HTMLElement | string;
    scale_with_zoom?: boolean;
    box_scale?: number;
}

export interface MapAction {
    ref: string;
    events: string[];
    callback: (p: Vec2) => void;
}

export interface MapViewChangeEvent {
    zoom: number;
    center: Vec2;
}

export interface MapInteractionOptions {
    disable_zoom?: boolean;
    disable_pan?: boolean;
}

interface OverlayInstance {
    overlay: MapOverlay;
    element: HTMLDivElement;
}

interface MapRect {
    left: number;
    top: number;
    width: number;
    height: number;
}

interface ElementBoundsResult {
    bounds: Map<string, Rect>;
    aspect_ratio: number;
}

const MAX_ZOOM = 10;
const MIN_ZOOM = 0.5;
const DEBOUNCED_ACTION_EVENTS = new Set([
    'click',
    'pointerenter',
    'pointerleave',
]);

function generateElementBounds(data: string): ElementBoundsResult {
    const bounds_map = new Map<string, Rect>();
    const container = document.createElement('div');
    container.style.cssText =
        'position:absolute;visibility:hidden;pointer-events:none;left:-9999px;top:-9999px;';
    container.innerHTML = data;
    document.body.appendChild(container);

    const svg_element = container.querySelector('svg');
    if (!svg_element) {
        document.body.removeChild(container);
        return { bounds: bounds_map, aspect_ratio: 1 };
    }

    const { width: svg_width, height: svg_height } =
        getSvgDimensions(svg_element);
    const aspect_ratio = svg_width / svg_height;
    bounds_map.set('map-viewer-root', {
        x: 0,
        y: 0,
        width: 1,
        height: 1,
    });

    svg_element.querySelectorAll('[id]').forEach((element) => {
        const id = element.getAttribute('id');
        if (
            !id ||
            typeof (element as SVGGraphicsElement).getBBox !== 'function'
        )
            return;
        try {
            const bbox = (element as SVGGraphicsElement).getBBox();
            bounds_map.set(id, {
                x: bbox.x / svg_width,
                y: bbox.y / svg_height,
                width: bbox.width / svg_width,
                height: bbox.height / svg_height,
            });
        } catch {
            // getBBox can throw for hidden or non-graphical elements.
        }
    });

    document.body.removeChild(container);
    return { bounds: bounds_map, aspect_ratio };
}

function getSvgDimensions(svg: SVGSVGElement): {
    width: number;
    height: number;
} {
    const view_box = svg.getAttribute('viewBox');
    if (view_box) {
        const parts = view_box.split(/[\s,]+/).map(parseFloat);
        if (parts.length >= 4 && parts[2] && parts[3]) {
            return { width: parts[2], height: parts[3] };
        }
    }

    const width_attr = svg.getAttribute('width');
    const height_attr = svg.getAttribute('height');
    const width = width_attr ? parseFloat(width_attr) : 0;
    const height = height_attr ? parseFloat(height_attr) : 0;
    if (width && height) return { width, height };

    try {
        const bbox = svg.getBBox();
        return { width: bbox.width || 1, height: bbox.height || 1 };
    } catch {
        return { width: 1, height: 1 };
    }
}

class MapStore {
    store: Map<string, MapDetails> = new Map();
    auth_type: 'cookie' | 'header' = 'cookie';
    token = '';
    auth_key = '';

    public setAuthToken(token: string, type: 'cookie' | 'header' = 'cookie') {
        this.token = token;
        this.auth_type = type;
    }

    public setAuthKey(key: string, type: 'cookie' | 'header' = 'cookie') {
        this.token = 'api-key';
        this.auth_key = key;
        this.auth_type = type;
    }

    public async get(path: string) {
        if (this.store.has(path)) return this.store.get(path);
        return this._load(path);
    }

    public remove(path: string) {
        this.store.delete(path);
    }

    private async _load(path: string) {
        const options: RequestInit = {};
        if (this.token) {
            if (this.auth_type === 'header') {
                options.headers = { Authorization: `Bearer ${this.token}` };
            } else {
                document.cookie = `${
                    this.token === 'api-key'
                        ? 'api-key=' + encodeURIComponent(this.auth_key)
                        : 'bearer_token=' + encodeURIComponent(this.token)
                };max-age=30;path=/;samesite=strict;${
                    location.protocol === 'https:' ? 'secure;' : ''
                }`;
            }
        }
        const response = await fetch(path, options);
        if (!response.ok) throw new Error('Failed to load map');
        const data = await response.text();
        const { bounds, aspect_ratio } = generateElementBounds(data);
        const map: MapDetails = {
            raw_data: data,
            element_bounds: bounds,
            aspect_ratio,
            loaded_at: Date.now(),
        };
        this.store.set(path, map);
        return map;
    }
}

const STORE = new MapStore();

export class MapViewer {
    public readonly id: string;
    public readonly container: Element;
    public readonly image: HTMLImageElement;
    public readonly gestures: HTMLElement;
    public readonly overlays: HTMLElement;
    public map: MapDetails;
    public styles_string = '';
    public center: Vec2 = { x: 0, y: 0 };
    public zoom = 1;
    public interaction_options: MapInteractionOptions = {};
    public onViewChange: ((event: MapViewChangeEvent) => void) | null = null;

    private _events = new Map<string, (e) => void>();
    private _overlay_instances: OverlayInstance[] = [];
    private _actions: MapAction[] = [];
    private _action_event_handlers = new Map<string, (e: Event) => void>();
    private _action_pointerdown_pos: Vec2 | null = null;
    private _action_last_triggered = new Map<string, number>();
    private _is_panning = false;
    private _pan_start_pointer: Vec2 | null = null;
    private _pan_start_center: Vec2 | null = null;
    private _pan_start_time: number | null = null;
    private _pan_exceeded_threshold = false;
    private _object_url = '';

    constructor(el: Element) {
        this.container = el;
        this.id = `m_view-${randomString(8, '0123456789ABCDEF')}`;
        this.container.innerHTML = '';
        (this.container as HTMLElement).style.position =
            getComputedStyle(this.container).position === 'static'
                ? 'relative'
                : getComputedStyle(this.container).position;
        (this.container as HTMLElement).style.overflow = 'hidden';
        (this.container as HTMLElement).style.touchAction = 'none';

        this.image = document.createElement('img');
        this.image.draggable = false;
        this.image.style.cssText =
            'position:absolute;z-index:0;max-width:none;max-height:none;transform-origin:0 0;user-select:none;pointer-events:none;';
        this.container.appendChild(this.image);

        this.gestures = document.createElement('div');
        this.gestures.id = `${this.id}-gestures`;
        this.gestures.style.cssText =
            'position:absolute;inset:0;z-index:1;pointer-events:auto;overflow:hidden;touch-action:none;';
        this.container.appendChild(this.gestures);

        this.overlays = document.createElement('div');
        this.overlays.id = `${this.id}-overlays`;
        this.overlays.style.cssText =
            'position:absolute;inset:0;z-index:2;pointer-events:none;overflow:hidden;touch-action:none;';
        this.container.appendChild(this.overlays);

        this._events.set('resize', () => this._renderMap());
        window.addEventListener('resize', this._events.get('resize'));

        this._events.set('wheel', (e: WheelEvent) => this._onWheel(e));
        this.gestures.addEventListener('wheel', this._events.get('wheel'), {
            passive: false,
        });
        this.overlays.addEventListener('wheel', this._events.get('wheel'), {
            passive: false,
        });

        this._events.set('pointerdown', (e: PointerEvent) =>
            this._onPointerDown(e)
        );
        this._events.set('pointermove', (e: PointerEvent) =>
            this._onPointerMove(e)
        );
        this._events.set('pointerup', (e: PointerEvent) =>
            this._onPointerUp(e)
        );
        this.gestures.addEventListener(
            'pointerdown',
            this._events.get('pointerdown')
        );
        this.gestures.addEventListener(
            'pointermove',
            this._events.get('pointermove')
        );
        this.gestures.addEventListener(
            'pointerup',
            this._events.get('pointerup')
        );
        this.overlays.addEventListener(
            'pointerdown',
            this._events.get('pointerdown')
        );
        this.overlays.addEventListener(
            'pointermove',
            this._events.get('pointermove')
        );
        this.overlays.addEventListener(
            'pointerup',
            this._events.get('pointerup')
        );
        window.addEventListener('pointermove', this._events.get('pointermove'));
        window.addEventListener('pointerup', this._events.get('pointerup'));
    }

    public async setMap(path: string) {
        this.map = await STORE.get(path);
        this._renderMapImage();
        return this.map;
    }

    public setCenter(point: Vec2) {
        this.center = this._clampCenter(point, this.zoom);
        this._renderMap();
    }

    public setZoom(new_zoom: number) {
        this.zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, new_zoom));
        this.center = this._clampCenter(this.center, this.zoom);
        this._renderMap();
        this._notifyViewChange();
    }

    public setInteractionOptions(options: MapInteractionOptions) {
        this.interaction_options = options;
    }

    public setOverlays(overlays: MapOverlay[]) {
        for (const instance of this._overlay_instances) {
            instance.element.remove();
        }
        this._overlay_instances = [];

        for (const overlay of overlays) {
            const element = document.createElement('div');
            element.style.cssText =
                'position:absolute;transform-origin:center center;pointer-events:none;';
            if (typeof overlay.contents === 'string') {
                element.innerHTML = overlay.contents;
            } else {
                overlay.contents.classList.remove('pointer-events-none');
                overlay.contents.style.pointerEvents = 'none';
                element.appendChild(overlay.contents);
            }
            this.overlays.appendChild(element);
            this._overlay_instances.push({ overlay, element });
        }

        this._updateOverlayPositions();
    }

    public setActions(actions: MapAction[]) {
        for (const [event_name, handler] of this._action_event_handlers) {
            this.gestures.removeEventListener(event_name, handler);
            this.overlays.removeEventListener(event_name, handler);
        }
        this._action_event_handlers.clear();
        this._action_last_triggered.clear();
        this._actions = actions;

        const event_names = new Set<string>();
        for (const action of actions) {
            for (const event_name of action.events) event_names.add(event_name);
        }

        for (const event_name of event_names) {
            const handler = (e: Event) =>
                this._handleActionEvent(event_name, e as PointerEvent);
            this._action_event_handlers.set(event_name, handler);
            this.gestures.addEventListener(event_name, handler);
            this.overlays.addEventListener(event_name, handler);
        }

        if (!this._events.has('action_pointerdown')) {
            const handler = (e: PointerEvent) => {
                this._action_pointerdown_pos = { x: e.clientX, y: e.clientY };
                try {
                    (e.currentTarget as HTMLElement)?.setPointerCapture?.(
                        e.pointerId
                    );
                } catch {
                    // Pointer capture only applies to active real pointer events.
                }
            };
            this._events.set('action_pointerdown', handler);
            this.gestures.addEventListener('pointerdown', handler);
            this.overlays.addEventListener('pointerdown', handler);
        }
    }

    public setStyles(styles: Map<string, CSSStyleDeclaration>) {
        let style_content = '';
        styles.forEach((style, selector) => {
            if (style.cssText)
                style_content += `${selector} { ${style.cssText} }\n`;
        });
        const new_styles_string = `<style>${style_content}</style>`;
        if (new_styles_string !== this.styles_string) {
            this.styles_string = new_styles_string;
            this._renderMapImage();
        }
    }

    public destroy() {
        window.removeEventListener('resize', this._events.get('resize'));
        this.gestures.removeEventListener('wheel', this._events.get('wheel'));
        this.overlays.removeEventListener('wheel', this._events.get('wheel'));
        this.gestures.removeEventListener(
            'pointerdown',
            this._events.get('pointerdown')
        );
        this.gestures.removeEventListener(
            'pointermove',
            this._events.get('pointermove')
        );
        this.gestures.removeEventListener(
            'pointerup',
            this._events.get('pointerup')
        );
        this.overlays.removeEventListener(
            'pointerdown',
            this._events.get('pointerdown')
        );
        this.overlays.removeEventListener(
            'pointermove',
            this._events.get('pointermove')
        );
        this.overlays.removeEventListener(
            'pointerup',
            this._events.get('pointerup')
        );
        window.removeEventListener(
            'pointermove',
            this._events.get('pointermove')
        );
        window.removeEventListener('pointerup', this._events.get('pointerup'));

        for (const [event_name, handler] of this._action_event_handlers) {
            this.gestures.removeEventListener(event_name, handler);
            this.overlays.removeEventListener(event_name, handler);
        }
        if (this._events.has('action_pointerdown')) {
            this.gestures.removeEventListener(
                'pointerdown',
                this._events.get('action_pointerdown')
            );
            this.overlays.removeEventListener(
                'pointerdown',
                this._events.get('action_pointerdown')
            );
        }
        this._revokeObjectUrl();
        this.container.innerHTML = '';
    }

    private _onWheel(e: WheelEvent) {
        e.preventDefault();
        if (this.interaction_options.disable_zoom || !this.map) return;

        const before = this._screenToMapPoint(e.clientX, e.clientY);
        const zoom_delta = e.deltaY > 0 ? 0.97 : 1.03;
        this.zoom = Math.max(
            MIN_ZOOM,
            Math.min(MAX_ZOOM, this.zoom * zoom_delta)
        );

        if (before) {
            const rect = this._getMapRect();
            const container_rect = this.container.getBoundingClientRect();
            const target_x =
                (e.clientX - container_rect.left - rect.left) / rect.width;
            const target_y =
                (e.clientY - container_rect.top - rect.top) / rect.height;
            this.center = this._clampCenter(
                {
                    x: this.center.x + before.x - target_x,
                    y: this.center.y + before.y - target_y,
                },
                this.zoom
            );
        } else {
            this.center = this._clampCenter(this.center, this.zoom);
        }

        this._renderMap();
        this._notifyViewChange();
    }

    private _onPointerDown(e: PointerEvent) {
        if (e.button !== 0 || this.interaction_options.disable_pan) return;
        e.preventDefault();
        try {
            (e.currentTarget as HTMLElement)?.setPointerCapture?.(e.pointerId);
        } catch {
            // Pointer capture is a convenience; window listeners keep the drag alive.
        }
        this._is_panning = true;
        this._pan_start_pointer = { x: e.clientX, y: e.clientY };
        this._pan_start_center = { ...this.center };
        this._pan_start_time = Date.now();
        this._pan_exceeded_threshold = false;
        (this.container as HTMLElement).style.cursor = 'grabbing';
    }

    private _onPointerMove(e: PointerEvent) {
        if (
            !this._is_panning ||
            !this._pan_start_pointer ||
            !this._pan_start_center
        )
            return;
        if (
            this._pan_start_time &&
            !this._pan_exceeded_threshold &&
            Date.now() - this._pan_start_time > 200
        ) {
            this._pan_exceeded_threshold = true;
        }

        const rect = this._getMapRect();
        const dx = (e.clientX - this._pan_start_pointer.x) / rect.width;
        const dy = (e.clientY - this._pan_start_pointer.y) / rect.height;
        this.center = this._clampCenter(
            {
                x: this._pan_start_center.x - dx,
                y: this._pan_start_center.y - dy,
            },
            this.zoom
        );
        this._renderMap();
        this._notifyViewChange();
    }

    private _onPointerUp(e?: PointerEvent) {
        if (e?.pointerId !== undefined) {
            try {
                (e.currentTarget as HTMLElement)?.releasePointerCapture?.(
                    e.pointerId
                );
            } catch {
                // Ignore missing capture for synthetic or cancelled pointer events.
            }
        }
        this._is_panning = false;
        this._pan_start_pointer = null;
        this._pan_start_center = null;
        (this.container as HTMLElement).style.cursor = '';
    }

    private _renderMapImage() {
        if (!this.map?.raw_data) return;
        const parser = new DOMParser();
        const doc = parser.parseFromString(this.map.raw_data, 'image/svg+xml');
        const svg_element = doc.querySelector('svg');
        if (!svg_element) return;

        svg_element.querySelector('style[data-injected]')?.remove();
        if (this.styles_string) {
            const style = doc.createElementNS(
                'http://www.w3.org/2000/svg',
                'style'
            );
            style.setAttribute('data-injected', 'true');
            style.textContent = this.styles_string
                .replace('<style>', '')
                .replace('</style>', '');
            svg_element.insertBefore(style, svg_element.firstChild);
        }

        this._revokeObjectUrl();
        this._object_url = URL.createObjectURL(
            new Blob([new XMLSerializer().serializeToString(svg_element)], {
                type: 'image/svg+xml',
            })
        );
        this.image.onload = () => this._renderMap();
        this.image.src = this._object_url;
    }

    private _renderMap() {
        if (!this.map) return;
        const rect = this._getMapRect();
        this.image.style.left = `${rect.left}px`;
        this.image.style.top = `${rect.top}px`;
        this.image.style.width = `${rect.width}px`;
        this.image.style.height = `${rect.height}px`;
        this._updateOverlayPositions();
    }

    private _updateOverlayPositions() {
        if (!this.map) return;
        const map_rect = this._getMapRect();
        for (const instance of this._overlay_instances) {
            const { overlay, element } = instance;
            const bounds = this._getOverlayBounds(overlay);
            if (!bounds) {
                element.style.display = 'none';
                continue;
            }
            element.style.display = '';
            if (overlay.type === 'box') {
                const scale = overlay.box_scale ?? 1;
                const width = bounds.width * map_rect.width * scale;
                const height = bounds.height * map_rect.height * scale;
                const left =
                    map_rect.left +
                    (bounds.x + bounds.width / 2) * map_rect.width -
                    width / 2;
                const top =
                    map_rect.top +
                    (bounds.y + bounds.height / 2) * map_rect.height -
                    height / 2;
                element.style.left = `${left}px`;
                element.style.top = `${top}px`;
                element.style.width = `${width}px`;
                element.style.height = `${height}px`;
                element.style.transform = '';
            } else {
                const left = map_rect.left + bounds.x * map_rect.width;
                const top = map_rect.top + bounds.y * map_rect.height;
                element.style.left = `${left}px`;
                element.style.top = `${top}px`;
                element.style.width = '';
                element.style.height = '';
                element.style.transform = overlay.scale_with_zoom
                    ? `translate(-50%, -50%) scale(${this.zoom})`
                    : 'translate(-50%, -50%)';
            }
        }
    }

    private _handleActionEvent(event_name: string, e: PointerEvent) {
        if (!this.map) return;
        if (this._pan_exceeded_threshold) return;
        if (event_name === 'click' && this._action_pointerdown_pos) {
            const dx = e.clientX - this._action_pointerdown_pos.x;
            const dy = e.clientY - this._action_pointerdown_pos.y;
            if (Math.sqrt(dx * dx + dy * dy) > 5) return;
        }

        const point = this._screenToMapPoint(e.clientX, e.clientY);
        if (!point) return;
        const now = Date.now();

        for (const action of this._actions) {
            if (!action.events.includes(event_name)) continue;
            if (action.ref !== '*') {
                const bounds = this.map.element_bounds.get(action.ref);
                if (!bounds || !pointInBounds(point, bounds)) continue;
            }

            if (DEBOUNCED_ACTION_EVENTS.has(event_name)) {
                const debounce_key = `${action.ref}:${event_name}`;
                const last_triggered =
                    this._action_last_triggered.get(debounce_key) || 0;
                if (now - last_triggered < 300) continue;
                this._action_last_triggered.set(debounce_key, now);
            }
            action.callback(point);
        }
    }

    private _getOverlayBounds(overlay: MapOverlay): Rect | null {
        if (typeof overlay.ref === 'string') {
            return this.map.element_bounds.get(overlay.ref) || null;
        }
        return { x: overlay.ref.x, y: overlay.ref.y, width: 0, height: 0 };
    }

    private _screenToMapPoint(client_x: number, client_y: number): Vec2 | null {
        const container_rect = this.container.getBoundingClientRect();
        const map_rect = this._getMapRect();
        const x =
            (client_x - container_rect.left - map_rect.left) / map_rect.width;
        const y =
            (client_y - container_rect.top - map_rect.top) / map_rect.height;
        if (x < 0 || x > 1 || y < 0 || y > 1) return null;
        return { x, y };
    }

    private _getMapRect(): MapRect {
        const container_width = this.container.clientWidth || 1;
        const container_height = this.container.clientHeight || 1;
        const aspect = this.map?.aspect_ratio || 1;
        const fit_width = Math.min(container_width, container_height * aspect);
        const fit_height = fit_width / aspect;
        const width = fit_width * this.zoom;
        const height = fit_height * this.zoom;
        return {
            left: (container_width - width) / 2 - this.center.x * width,
            top: (container_height - height) / 2 - this.center.y * height,
            width,
            height,
        };
    }

    private _clampCenter(point: Vec2, zoom: number): Vec2 {
        const container_width = this.container.clientWidth || 1;
        const container_height = this.container.clientHeight || 1;
        const aspect = this.map?.aspect_ratio || 1;
        const fit_width = Math.min(container_width, container_height * aspect);
        const fit_height = fit_width / aspect;
        const width = fit_width * zoom;
        const height = fit_height * zoom;
        const max_x = Math.max(0, (width - container_width) / (2 * width));
        const max_y = Math.max(0, (height - container_height) / (2 * height));
        return {
            x: Math.max(-max_x, Math.min(max_x, point.x)),
            y: Math.max(-max_y, Math.min(max_y, point.y)),
        };
    }

    private _notifyViewChange() {
        this.onViewChange?.({
            zoom: this.zoom,
            center: { ...this.center },
        });
    }

    private _revokeObjectUrl() {
        if (this._object_url) URL.revokeObjectURL(this._object_url);
        this._object_url = '';
    }
}

function pointInBounds(point: Vec2, bounds: Rect) {
    return (
        point.x >= bounds.x &&
        point.x <= bounds.x + bounds.width &&
        point.y >= bounds.y &&
        point.y <= bounds.y + bounds.height
    );
}
