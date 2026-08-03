import {
    Component,
    ElementRef,
    HostListener,
    computed,
    inject,
    signal,
    viewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IconComponent } from '@placeos-tools/components';

import { MapObject } from '../data/types';
import { AssetPickerComponent } from './asset-picker.component';
import { AvailabilityPanelComponent } from './availability-panel.component';
import { CanvasComponent } from './canvas.component';
import {
    SIDEBAR_DEFAULTS,
    SIDEBAR_MAX,
    SIDEBAR_MIN,
    Tool,
    clampSidebar,
    nextSidebarWidth,
} from './constants';
import { EditorStateService } from './editor-state.service';
import { LabellingPanelComponent } from './labelling-panel.component';
import { LayerPanelComponent } from './layer-panel.component';
import { MinimapComponent } from './minimap.component';
import { ObjectListPanelComponent } from './object-list-panel.component';
import { PropertiesPanelComponent } from './properties-panel.component';
import { PublishPanelComponent } from './publish-panel.component';
import { ToastsComponent } from './toast.service';
import { ValidationPanelComponent } from './validation-panel.component';

/** Toolbar button, styled after the reference app's `.dc-tool-btn` */
const TOOL_BTN =
    'inline-flex shrink-0 items-center gap-1 rounded-md border border-transparent px-2 py-1.5 text-xs font-medium leading-none whitespace-nowrap disabled:opacity-35';
const TOOL_BTN_IDLE =
    'text-base-content/60 hover:bg-base-200 hover:text-base-content';
const TOOL_BTN_ACTIVE = 'bg-primary/10 text-primary border-primary/30';

const SIDEBAR_KEY = 'map-builder.editor-sidebars';

const TOOLS: { id: Tool; label: string; key: string; icon: string }[] = [
    { id: 'select', label: 'Select', key: 'V', icon: 'arrow_selector_tool' },
    { id: 'rect', label: 'Rect', key: 'R', icon: 'crop_square' },
    { id: 'polygon', label: 'Poly', key: 'O', icon: 'pentagon' },
    { id: 'pen', label: 'Place', key: 'P', icon: 'add_box' },
    { id: 'wall', label: 'Wall', key: 'W', icon: 'straighten' },
];

@Component({
    selector: 'map-builder-editor',
    providers: [EditorStateService],
    template: `
        <div class="bg-base-200 absolute inset-0 flex flex-col">
            <!-- Nav bar, matching the reference app's breadcrumb strip -->
            <nav
                class="bg-secondary text-secondary-content flex h-13 shrink-0 items-center gap-3 px-5"
            >
                <button
                    class="flex items-center gap-2 rounded-lg bg-white/15 px-3.5 py-1.5 text-sm font-semibold hover:bg-white/25"
                    (click)="leave()"
                >
                    <app-icon class="text-base">arrow_back</app-icon>
                    Back
                </button>
                <span class="text-lg font-extrabold tracking-tight">
                    PlaceOS
                </span>
                <span class="text-sm font-medium opacity-60">
                    / Floor Plan Studio
                </span>
                <span class="truncate text-sm opacity-45">
                    / {{ state.floorplan()?.floor_name || 'Editor' }}
                </span>
            </nav>

            <!-- Toolbar. Two fixed rows: what you draw, then how you edit. -->
            <header
                class="bg-base-100 border-base-300 flex shrink-0 flex-col gap-1 overflow-x-auto border-b px-2.5 py-1.5 whitespace-nowrap"
            >
                <div class="flex items-center gap-1">
                    <div class="flex shrink-0 items-center gap-0.5">
                        @for (tool of tools; track tool.id) {
                            <button
                                [class]="
                                    toolClass(state.active_tool() === tool.id)
                                "
                                [title]="
                                    tool.key
                                        ? tool.label + ' (' + tool.key + ')'
                                        : tool.label
                                "
                                (click)="pickTool(tool.id)"
                            >
                                <app-icon class="text-base">
                                    {{ tool.icon }}
                                </app-icon>
                                {{ tool.label }}
                            </button>
                        }
                    </div>

                    <span class="bg-base-300 mx-1.5 h-6 w-px shrink-0"></span>

                    <map-builder-asset-picker />

                    <!-- Search, right-aligned as in the reference toolbar -->
                    <div class="relative ml-auto shrink-0">
                        <input
                            #search_input
                            class="border-base-300 w-36 rounded border px-2 py-1 text-xs"
                            placeholder="Search (Ctrl+F)"
                            aria-label="Search objects"
                            [value]="search()"
                            (input)="search.set(asValue($event))"
                            (keydown.escape)="search.set('')"
                        />
                        @if (search_results(); as results) {
                            <div
                                class="bg-base-100 border-base-300 absolute top-full right-0 z-30 mt-1 max-h-52 w-56 overflow-y-auto rounded-md border shadow-lg"
                            >
                                @for (object of results; track object.id) {
                                    <button
                                        class="border-base-300 hover:bg-base-200 flex w-full items-center gap-1.5 border-b px-2.5 py-1.5 text-left text-xs last:border-b-0"
                                        (click)="reveal(object)"
                                    >
                                        <span
                                            class="flex-1 truncate font-medium"
                                        >
                                            {{ object.label }}
                                        </span>
                                        <span
                                            class="text-base-content/60 text-[0.65rem] uppercase"
                                        >
                                            {{ object.object_type }}
                                        </span>
                                    </button>
                                }
                                @if (!results.length) {
                                    <p
                                        class="text-base-content/60 m-0 px-2.5 py-2 text-center text-xs"
                                    >
                                        No results
                                    </p>
                                }
                            </div>
                        }
                    </div>
                </div>

                <div class="flex items-center gap-1">
                    <!-- Actions -->
                    <div class="flex shrink-0 items-center gap-0.5">
                        <button
                            [class]="toolClass(state.dirty())"
                            [title]="
                                state.dirty()
                                    ? 'Save changes (Ctrl+S)'
                                    : 'No unsaved changes'
                            "
                            [disabled]="state.saving() || !state.dirty()"
                            (click)="state.save()"
                        >
                            <app-icon class="text-base">save</app-icon>
                            {{ state.saving() ? 'Saving...' : 'Save' }}
                        </button>
                        <button
                            [class]="toolClass(false)"
                            title="Undo (Ctrl+Z)"
                            [disabled]="!state.can_undo()"
                            (click)="state.undo()"
                        >
                            <app-icon class="text-base">undo</app-icon>
                            Undo
                        </button>
                        <button
                            [class]="toolClass(false)"
                            title="Redo (Ctrl+Shift+Z)"
                            [disabled]="!state.can_redo()"
                            (click)="state.redo()"
                        >
                            <app-icon class="text-base">redo</app-icon>
                            Redo
                        </button>
                        <!-- sr-only, not hidden, so the input stays keyboard reachable -->
                        <label
                            [class]="toolClass(false) + ' cursor-pointer'"
                            title="Upload a background image"
                        >
                            <app-icon class="text-base">upload</app-icon>
                            Image
                            <input
                                type="file"
                                accept="image/*"
                                class="sr-only"
                                (change)="onUpload($event)"
                            />
                        </label>
                    </div>

                    <span class="bg-base-300 mx-1.5 h-6 w-px shrink-0"></span>

                    <!-- View -->
                    <div class="flex shrink-0 items-center gap-0.5">
                        <button
                            [class]="toolClass(state.grid_enabled())"
                            title="Toggle grid (G)"
                            (click)="state.toggleGrid()"
                        >
                            <app-icon class="text-base">grid_on</app-icon>
                            Grid
                        </button>
                        @if (state.grid_enabled()) {
                            <input
                                type="number"
                                min="5"
                                max="100"
                                step="5"
                                class="border-base-300 w-11 rounded border px-1 py-0.5 text-center text-xs"
                                title="Grid size (px)"
                                aria-label="Grid size in pixels"
                                [value]="state.grid_size()"
                                (change)="state.setGridSize(+asValue($event))"
                            />
                        }
                        <button
                            [class]="toolClass(state.snap_enabled())"
                            title="Toggle snapping"
                            (click)="state.toggleSnap()"
                        >
                            <app-icon class="text-base"
                                >grid_goldenratio</app-icon
                            >
                            Snap
                        </button>
                        <select
                            id="active-layer"
                            class="border-base-300 ml-1 shrink-0 rounded border px-2 py-1 text-xs"
                            title="Active layer"
                            aria-label="Active layer"
                            (change)="state.setActiveLayer(asValue($event))"
                        >
                            @for (
                                layer of state.sorted_layers();
                                track layer.id
                            ) {
                                <option
                                    [value]="layer.id"
                                    [selected]="
                                        layer.id === state.active_layer_id()
                                    "
                                >
                                    {{ layer.name }}
                                </option>
                            }
                        </select>
                    </div>
                </div>
            </header>

            @if (state.error(); as message) {
                <div class="bg-error-light text-error px-4 py-2 text-sm">
                    {{ message }}
                </div>
            }

            @if (state.loading()) {
                <div
                    class="text-base-content/60 flex flex-1 flex-col items-center justify-center gap-4"
                >
                    <div
                        class="border-base-300 border-t-primary h-8 w-8 animate-spin rounded-full border-4"
                    ></div>
                    <p class="text-sm">Loading editor...</p>
                </div>
            } @else {
                <div class="relative flex min-h-0 flex-1">
                    <!-- Left sidebar -->
                    <aside
                        class="bg-base-100 border-base-300 flex shrink-0 flex-col border-r"
                        [style.width.px]="left_width()"
                    >
                        <div class="border-base-300 flex border-b">
                            <button
                                class="flex-1 px-3 py-2 text-xs font-semibold"
                                [class]="
                                    left_tab() === 'layers'
                                        ? 'border-primary border-b-2'
                                        : 'text-base-content/60'
                                "
                                (click)="left_tab.set('layers')"
                            >
                                Layers
                            </button>
                            <button
                                class="flex-1 px-3 py-2 text-xs font-semibold"
                                [class]="
                                    left_tab() === 'objects'
                                        ? 'border-primary border-b-2'
                                        : 'text-base-content/60'
                                "
                                (click)="left_tab.set('objects')"
                            >
                                Objects
                            </button>
                        </div>
                        <div class="min-h-0 flex-1">
                            @if (left_tab() === 'layers') {
                                <map-builder-layer-panel />
                            } @else {
                                <map-builder-object-list-panel
                                    (scrollTo)="scrollTo($event)"
                                />
                            }
                        </div>
                    </aside>

                    <!-- Canvas -->
                    <main class="relative min-w-0 flex-1">
                        <map-builder-canvas />
                        <!-- Zoom controls, matching <dynamic-map>'s overlay stack -->
                        <div
                            class="border-base-300 bg-base-100 absolute top-3 right-3 z-20 flex flex-col overflow-hidden rounded border shadow"
                        >
                            <button
                                class="hover:bg-base-200 border-base-300 border-b p-1 text-base"
                                title="Zoom in"
                                (click)="state.zoomBy(1.1)"
                            >
                                <app-icon>add</app-icon>
                            </button>
                            <button
                                class="hover:bg-base-200 border-base-300 border-b p-1 text-base"
                                title="Zoom out"
                                (click)="state.zoomBy(10 / 11)"
                            >
                                <app-icon>remove</app-icon>
                            </button>
                            <button
                                class="hover:bg-base-200 p-1 text-base"
                                title="Reset zoom"
                                (click)="resetView()"
                            >
                                <app-icon>refresh</app-icon>
                            </button>
                        </div>
                        @if (canvas()?.containerEl(); as container) {
                            <map-builder-minimap [container]="container" />
                        }
                    </main>

                    <!-- Right sidebar -->
                    <aside
                        class="bg-base-100 border-base-300 flex shrink-0 flex-col border-l"
                        [style.width.px]="right_width()"
                    >
                        <div class="border-base-300 flex border-b">
                            @for (tab of right_tabs; track tab.id) {
                                <button
                                    class="flex-1 px-1 py-2 text-xs font-semibold"
                                    [class]="
                                        right_tab() === tab.id
                                            ? 'border-primary border-b-2'
                                            : 'text-base-content/60'
                                    "
                                    [title]="tab.title"
                                    (click)="right_tab.set(tab.id)"
                                >
                                    {{ tab.label }}
                                </button>
                            }
                        </div>
                        <div class="min-h-0 flex-1">
                            @switch (right_tab()) {
                                @case ('properties') {
                                    <map-builder-properties-panel />
                                }
                                @case ('label') {
                                    <map-builder-labelling-panel />
                                }
                                @case ('validate') {
                                    <map-builder-validation-panel />
                                }
                                @case ('preview') {
                                    <map-builder-availability-panel />
                                }
                                @case ('publish') {
                                    <map-builder-publish-panel />
                                }
                            }
                        </div>
                    </aside>

                    <!-- Resize handles. Overlaid on the sidebar borders rather
                         than placed in the flow, so they take no layout space
                         and never paint a strip beside the canvas. -->
                    <div
                        role="separator"
                        tabindex="0"
                        aria-orientation="vertical"
                        aria-label="Resize the layers and objects panel"
                        [attr.aria-valuenow]="left_width()"
                        [attr.aria-valuemin]="sidebar_min"
                        [attr.aria-valuemax]="sidebar_max"
                        class="hover:bg-primary/40 focus-visible:bg-primary/40 absolute inset-y-0 z-30 w-1 cursor-col-resize"
                        [style.left.px]="left_width() - 2"
                        (pointerdown)="startResize($event, 'left')"
                        (keydown.arrowleft)="nudge($event, 'left', -16)"
                        (keydown.arrowright)="nudge($event, 'left', 16)"
                    ></div>
                    <div
                        role="separator"
                        tabindex="0"
                        aria-orientation="vertical"
                        aria-label="Resize the properties panel"
                        [attr.aria-valuenow]="right_width()"
                        [attr.aria-valuemin]="sidebar_min"
                        [attr.aria-valuemax]="sidebar_max"
                        class="hover:bg-primary/40 focus-visible:bg-primary/40 absolute inset-y-0 z-30 w-1 cursor-col-resize"
                        [style.right.px]="right_width() - 2"
                        (pointerdown)="startResize($event, 'right')"
                        (keydown.arrowleft)="nudge($event, 'right', -16)"
                        (keydown.arrowright)="nudge($event, 'right', 16)"
                    ></div>
                </div>

                <!-- Status bar -->
                <footer
                    class="bg-base-100 border-base-300 text-base-content/60 flex shrink-0 items-center gap-5 overflow-x-auto border-t px-4 py-1.5 text-[0.72rem] whitespace-nowrap"
                >
                    <span>{{ zoomPercent() }}% zoom</span>
                    <span
                        aria-hidden="true"
                        class="bg-base-300 h-3 w-px shrink-0"
                    ></span>
                    <span>
                        {{ state.objects().length }}
                        {{
                            state.objects().length === 1 ? 'object' : 'objects'
                        }}
                    </span>
                    <span
                        aria-hidden="true"
                        class="bg-base-300 h-3 w-px shrink-0"
                    ></span>
                    <span>
                        Grid: {{ state.grid_size() }}px
                        {{ state.grid_enabled() ? '' : '(off)' }}
                    </span>
                    <span
                        aria-hidden="true"
                        class="bg-base-300 h-3 w-px shrink-0"
                    ></span>
                    <span>Snap: {{ state.snap_enabled() ? 'On' : 'Off' }}</span>
                    @if (canvas()?.cursor_coords(); as coords) {
                        <span
                            aria-hidden="true"
                            class="bg-base-300 h-3 w-px shrink-0"
                        ></span>
                        <span>X: {{ coords.x }} Y: {{ coords.y }}</span>
                    }
                    @if (state.selected(); as selected) {
                        <span
                            aria-hidden="true"
                            class="bg-base-300 h-3 w-px shrink-0"
                        ></span>
                        <span class="text-base-content font-semibold">
                            {{
                                selected.label ||
                                    selected.svg_id ||
                                    selected.id.slice(0, 8)
                            }}
                            <span class="text-base-content/60 ml-1 font-normal">
                                ({{ selected.object_type }})
                                {{ round(selected.geometry.width ?? 0) }}x{{
                                    round(selected.geometry.height ?? 0)
                                }}
                            </span>
                        </span>
                    }
                    @if (state.placing(); as placing) {
                        <span class="text-primary font-semibold">
                            Click to place {{ placing.id }} (Esc to cancel)
                        </span>
                    }
                    <span class="ml-auto flex items-center gap-2">
                        <span class="capitalize">{{ state.mode() }} mode</span>
                        <span
                            aria-hidden="true"
                            class="bg-base-300 h-3 w-px shrink-0"
                        ></span>
                        <span>
                            {{ state.floorplan()?.floor_name }} v{{
                                state.floorplan()?.version
                            }}
                        </span>
                        @if (state.dirty()) {
                            <span class="font-semibold text-[#d97706]">
                                Unsaved
                            </span>
                        } @else if (state.last_saved()) {
                            <span class="text-success">Saved</span>
                        }
                        <span
                            aria-hidden="true"
                            class="bg-base-300 h-3 w-px shrink-0"
                        ></span>
                        <button
                            class="border-base-300 hover:bg-base-200 flex size-5.5 items-center justify-center rounded border bg-transparent text-xs font-bold"
                            title="Keyboard shortcuts (?)"
                            aria-label="Keyboard shortcuts"
                            (click)="show_shortcuts.set(true)"
                        >
                            ?
                        </button>
                    </span>
                </footer>
            }

            @if (show_shortcuts()) {
                <div
                    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    role="presentation"
                    (click)="show_shortcuts.set(false)"
                >
                    <section
                        class="bg-base-100 max-h-[80vh] w-[min(90%,32rem)] overflow-y-auto rounded-xl px-7 py-6 shadow-2xl"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="shortcuts-title"
                        (click)="$event.stopPropagation()"
                    >
                        <header class="mb-5 flex items-center justify-between">
                            <h2 id="shortcuts-title" class="text-lg font-bold">
                                Keyboard Shortcuts
                            </h2>
                            <button
                                class="hover:bg-base-200 rounded px-2 py-1 text-xl"
                                aria-label="Close keyboard shortcuts"
                                (click)="show_shortcuts.set(false)"
                            >
                                &times;
                            </button>
                        </header>
                        @for (shortcut of shortcuts; track shortcut.key) {
                            <div
                                class="border-base-300 flex items-center justify-between border-b py-2 text-sm last:border-b-0"
                            >
                                <span>{{ shortcut.label }}</span>
                                <kbd
                                    class="bg-base-200 border-base-300 rounded border px-2 py-0.5 font-mono text-xs"
                                >
                                    {{ shortcut.key }}
                                </kbd>
                            </div>
                        }
                    </section>
                </div>
            }

            <map-builder-toasts />
        </div>
    `,
    imports: [
        AssetPickerComponent,
        AvailabilityPanelComponent,
        CanvasComponent,
        IconComponent,
        LabellingPanelComponent,
        LayerPanelComponent,
        MinimapComponent,
        ObjectListPanelComponent,
        PropertiesPanelComponent,
        PublishPanelComponent,
        ToastsComponent,
        ValidationPanelComponent,
    ],
})
export class EditorComponent {
    public readonly state = inject(EditorStateService);
    private readonly _route = inject(ActivatedRoute);
    private readonly _router = inject(Router);

    public readonly canvas = viewChild(CanvasComponent);
    public readonly searchInput =
        viewChild<ElementRef<HTMLInputElement>>('search_input');

    public readonly tools = TOOLS;
    public readonly left_tab = signal<'layers' | 'objects'>('layers');
    public readonly search = signal('');
    public readonly show_shortcuts = signal(false);

    public readonly shortcuts = [
        { key: 'V', label: 'Select' },
        { key: 'R', label: 'Rectangle' },
        { key: 'O', label: 'Polygon' },
        { key: 'P', label: 'Place object' },
        { key: 'W', label: 'Wall' },
        { key: 'G', label: 'Toggle grid' },
        { key: 'Ctrl/\u2318 S', label: 'Save' },
        { key: 'Ctrl/\u2318 Z', label: 'Undo' },
        { key: 'Ctrl/\u2318 Shift Z', label: 'Redo' },
        { key: 'Delete', label: 'Delete selected' },
        { key: 'Esc', label: 'Deselect or cancel' },
    ];

    public readonly sidebar_min = SIDEBAR_MIN;
    public readonly sidebar_max = SIDEBAR_MAX;
    public readonly left_width = signal(SIDEBAR_DEFAULTS.left);
    public readonly right_width = signal(SIDEBAR_DEFAULTS.right);

    public readonly toolClass = (active: boolean) =>
        `${TOOL_BTN} ${active ? TOOL_BTN_ACTIVE : TOOL_BTN_IDLE}`;

    /** Rooms and desks matching the toolbar search — null hides the dropdown */
    public readonly search_results = computed(() => {
        const query = this.search().trim().toLowerCase();
        if (!query) return null;
        return this.state
            .objects()
            .filter(
                (object) =>
                    (object.object_type === 'room' ||
                        object.object_type === 'desk') &&
                    object.label?.toLowerCase().includes(query),
            )
            .slice(0, 8);
    });

    public readonly right_tabs = [
        { id: 'properties' as const, label: 'Props', title: 'Properties' },
        { id: 'label' as const, label: 'Label', title: 'Labelling' },
        { id: 'validate' as const, label: 'Check', title: 'Validation' },
        { id: 'preview' as const, label: 'Preview', title: 'Availability' },
        { id: 'publish' as const, label: 'Publish', title: 'Publish & export' },
    ];
    public readonly right_tab = signal<
        'properties' | 'label' | 'validate' | 'preview' | 'publish'
    >('properties');

    public readonly zoomPercent = computed(() =>
        Math.round(this.state.zoom() * 100),
    );

    public readonly backLink = computed(() => {
        const project_id = this.state.floorplan()?.project_id;
        return project_id ? ['/project', project_id] : ['/'];
    });

    public readonly asValue = (event: Event) =>
        (event.target as HTMLSelectElement).value;

    public readonly round = Math.round;

    constructor() {
        this._restoreWidths();
        const id = this._route.snapshot.paramMap.get('floorplan_id') ?? '';
        this.state.load(id);
    }

    // ── Sidebar resizing ────────────────────────────────────────────────────

    private _widthFor(side: 'left' | 'right') {
        return side === 'left' ? this.left_width : this.right_width;
    }

    /**
     * Drag a separator. The listeners live on the window, not the handle, so
     * the drag survives the pointer outrunning a 4px strip.
     */
    public startResize(event: PointerEvent, side: 'left' | 'right') {
        event.preventDefault();
        const width = this._widthFor(side);
        const start_x = event.clientX;
        const start_width = width();

        const onMove = (move: PointerEvent) =>
            width.set(
                nextSidebarWidth(start_width, move.clientX - start_x, side),
            );
        const onDone = () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onDone);
            window.removeEventListener('pointercancel', onDone);
            this._saveWidths();
        };

        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onDone);
        window.addEventListener('pointercancel', onDone);
    }

    /** Keyboard equivalent, so the separators are not mouse-only */
    public nudge(event: Event, side: 'left' | 'right', delta: number) {
        event.preventDefault();
        const width = this._widthFor(side);
        width.set(nextSidebarWidth(width(), delta, side));
        this._saveWidths();
    }

    private _restoreWidths() {
        try {
            const stored = JSON.parse(
                localStorage.getItem(SIDEBAR_KEY) || '{}',
            );
            this.left_width.set(
                clampSidebar(stored.left ?? SIDEBAR_DEFAULTS.left),
            );
            this.right_width.set(
                clampSidebar(stored.right ?? SIDEBAR_DEFAULTS.right),
            );
        } catch {
            // Unreadable or absent — the defaults already apply
        }
    }

    private _saveWidths() {
        localStorage.setItem(
            SIDEBAR_KEY,
            JSON.stringify({
                left: this.left_width(),
                right: this.right_width(),
            }),
        );
    }

    /** Reset zoom and scroll back to the origin, like <dynamic-map>'s reset. */
    public resetView() {
        this.state.setZoom(1);
        this.canvas()?.containerEl()?.scrollTo({ top: 0, left: 0 });
    }

    public pickTool(tool: Tool) {
        this.canvas()?.cancelDrawing();
        this.state.setTool(tool);
    }

    public scrollTo(object: MapObject) {
        this.canvas()?.scrollIntoView(object);
    }

    /** Select a search hit, bring it into view and close the dropdown */
    public reveal(object: MapObject) {
        this.state.select(object.id);
        this.search.set('');
        this.canvas()?.scrollIntoView(object);
    }

    /** Warn before dropping unsaved work on the way back to the project */
    public leave() {
        if (
            this.state.dirty() &&
            !confirm('You have unsaved changes. Leave without saving?')
        )
            return;
        this._router.navigate(this.backLink());
    }

    @HostListener('window:beforeunload', ['$event'])
    public onBeforeUnload(event: BeforeUnloadEvent) {
        if (this.state.dirty()) event.preventDefault();
    }

    public async onUpload(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (file) await this.state.uploadSourceImage(file);
        input.value = '';
    }

    @HostListener('window:keydown', ['$event'])
    public onKeyDown(event: KeyboardEvent) {
        const target = event.target as HTMLElement;
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

        const mod = event.ctrlKey || event.metaKey;

        if (mod && event.key.toLowerCase() === 's') {
            event.preventDefault();
            if (this.state.dirty() && !this.state.saving()) this.state.save();
            return;
        }
        if (mod && event.key.toLowerCase() === 'z') {
            event.preventDefault();
            if (event.shiftKey) this.state.redo();
            else this.state.undo();
            return;
        }
        if (mod && event.key.toLowerCase() === 'y') {
            event.preventDefault();
            this.state.redo();
            return;
        }
        if (mod && event.key.toLowerCase() === 'f') {
            event.preventDefault();
            this.searchInput()?.nativeElement.focus();
            return;
        }
        if (mod && event.key.toLowerCase() === 'd') {
            event.preventDefault();
            const selected = this.state.selected_id();
            if (selected) this.state.duplicateObject(selected);
            return;
        }
        if (mod) return;

        if (event.key === 'Escape') {
            if (this.show_shortcuts()) {
                this.show_shortcuts.set(false);
                return;
            }
            this.state.select(null);
            this.state.clearMultiSelect();
            this.state.cancelPlacing();
            this.canvas()?.cancelDrawing();
            if (this.state.active_tool() === 'wall')
                this.state.setTool('select');
            return;
        }
        if (event.key === '?') {
            this.show_shortcuts.set(true);
            return;
        }
        if (event.key === 'Delete' || event.key === 'Backspace') {
            const selected = this.state.selected_id();
            if (selected) {
                event.preventDefault();
                this.state.deleteObject(selected);
            }
            return;
        }

        switch (event.key.toLowerCase()) {
            case 'v':
                this.pickTool('select');
                break;
            case 'r':
                this.pickTool('rect');
                break;
            case 'p':
                this.pickTool('pen');
                break;
            case 'w':
                this.pickTool('wall');
                break;
            case 'o':
                this.pickTool('polygon');
                break;
            case 'g':
                this.state.toggleGrid();
                break;
        }
    }
}
