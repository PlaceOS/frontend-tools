import {
    Component,
    HostListener,
    computed,
    inject,
    signal,
    viewChild,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IconComponent } from '@placeos-tools/components';

import { MapObject } from '../data/types';
import { AssetPickerComponent } from './asset-picker.component';
import { AvailabilityPanelComponent } from './availability-panel.component';
import { CanvasComponent } from './canvas.component';
import { Tool } from './constants';
import { EditorStateService } from './editor-state.service';
import { LabellingPanelComponent } from './labelling-panel.component';
import { LayerPanelComponent } from './layer-panel.component';
import { MinimapComponent } from './minimap.component';
import { ObjectListPanelComponent } from './object-list-panel.component';
import { PropertiesPanelComponent } from './properties-panel.component';
import { PublishPanelComponent } from './publish-panel.component';
import { ToastsComponent } from './toast.service';
import { ValidationPanelComponent } from './validation-panel.component';

const TOOLS: { id: Tool; label: string; key: string; icon: string }[] = [
    { id: 'select', label: 'Select', key: 'V', icon: 'arrow_selector_tool' },
    { id: 'rect', label: 'Rectangle', key: 'R', icon: 'crop_square' },
    { id: 'polygon', label: 'Polygon', key: '', icon: 'pentagon' },
    { id: 'pen', label: 'Place', key: 'P', icon: 'add_box' },
    { id: 'wall', label: 'Wall', key: 'W', icon: 'straighten' },
];

@Component({
    selector: 'map-builder-editor',
    providers: [EditorStateService],
    template: `
        <div class="bg-base-200 absolute inset-0 flex flex-col">
            <!-- Toolbar -->
            <header
                class="bg-base-100 border-base-300 flex shrink-0 items-center gap-2 overflow-x-auto border-b px-3 py-2 whitespace-nowrap"
            >
                <a
                    btn
                    class="clear min-h-0! shrink-0 gap-1 px-2! py-1! text-xs"
                    [routerLink]="backLink()"
                >
                    <app-icon class="text-base">arrow_back</app-icon>
                    Back
                </a>

                <span class="shrink-0 text-sm font-semibold">
                    {{ state.floorplan()?.floor_name || 'Editor' }}
                </span>

                <div class="bg-base-300 mx-1 h-6 w-px shrink-0"></div>

                @for (tool of tools; track tool.id) {
                    <button
                        class="border-base-300 shrink-0 rounded border p-1.5 text-lg"
                        [class]="
                            state.active_tool() === tool.id
                                ? 'bg-primary text-primary-content border-primary'
                                : 'bg-base-100 hover:bg-base-200'
                        "
                        [title]="
                            tool.key
                                ? tool.label + ' (' + tool.key + ')'
                                : tool.label
                        "
                        (click)="pickTool(tool.id)"
                    >
                        <app-icon>{{ tool.icon }}</app-icon>
                    </button>
                }

                <div class="bg-base-300 mx-1 h-6 w-px"></div>

                <select
                    id="active-layer"
                    class="border-base-300 shrink-0 rounded border px-2 py-1 text-xs"
                    title="Active layer"
                    aria-label="Active layer"
                    (change)="state.setActiveLayer(asValue($event))"
                >
                    @for (layer of state.sorted_layers(); track layer.id) {
                        <option
                            [value]="layer.id"
                            [selected]="layer.id === state.active_layer_id()"
                        >
                            {{ layer.name }}
                        </option>
                    }
                </select>

                <button
                    class="border-base-300 shrink-0 rounded border px-2 py-1 text-xs"
                    [class]="
                        state.grid_enabled()
                            ? 'bg-primary text-primary-content border-primary'
                            : 'bg-base-100'
                    "
                    title="Toggle grid (G)"
                    (click)="state.toggleGrid()"
                >
                    Grid
                </button>
                <button
                    class="border-base-300 shrink-0 rounded border px-2 py-1 text-xs"
                    [class]="
                        state.snap_enabled()
                            ? 'bg-primary text-primary-content border-primary'
                            : 'bg-base-100'
                    "
                    title="Toggle snapping"
                    (click)="state.toggleSnap()"
                >
                    Snap
                </button>

                <div class="bg-base-300 mx-1 h-6 w-px"></div>

                <map-builder-asset-picker />

                <div class="bg-base-300 mx-1 h-6 w-px"></div>

                <button
                    class="border-base-300 bg-base-100 hover:bg-base-200 rounded border p-1 text-base disabled:opacity-40"
                    title="Undo (Ctrl+Z)"
                    [disabled]="!state.can_undo()"
                    (click)="state.undo()"
                >
                    <app-icon>undo</app-icon>
                </button>
                <button
                    class="border-base-300 bg-base-100 hover:bg-base-200 rounded border p-1 text-base disabled:opacity-40"
                    title="Redo (Ctrl+Shift+Z)"
                    [disabled]="!state.can_redo()"
                    (click)="state.redo()"
                >
                    <app-icon>redo</app-icon>
                </button>

                <div class="ml-auto flex shrink-0 items-center gap-2">
                    <span class="text-base-content/60 text-xs">
                        {{ zoomPercent() }}%
                    </span>
                    <button
                        class="border-base-300 bg-base-100 hover:bg-base-200 rounded border p-1 text-base"
                        title="Zoom out"
                        (click)="state.zoomBy(0.9)"
                    >
                        <app-icon>zoom_out</app-icon>
                    </button>
                    <button
                        class="border-base-300 bg-base-100 hover:bg-base-200 rounded border p-1 text-base"
                        title="Zoom in"
                        (click)="state.zoomBy(1.1)"
                    >
                        <app-icon>zoom_in</app-icon>
                    </button>

                    <label
                        class="border-base-300 bg-base-100 hover:bg-base-200 shrink-0 cursor-pointer rounded border p-1 text-base"
                        title="Upload a background image"
                    >
                        <app-icon>upload</app-icon>
                        <input
                            type="file"
                            accept="image/*"
                            class="hidden"
                            (change)="onUpload($event)"
                        />
                    </label>

                    <button
                        btn
                        class="min-h-0! shrink-0 gap-1 px-3! py-1! text-xs"
                        [disabled]="state.saving()"
                        (click)="state.save()"
                    >
                        <app-icon class="text-base">save</app-icon>
                        {{ state.saving() ? 'Saving...' : 'Save' }}
                    </button>
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
                <div class="flex min-h-0 flex-1">
                    <!-- Left sidebar -->
                    <aside
                        class="bg-base-100 border-base-300 flex w-64 shrink-0 flex-col border-r"
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
                        @if (canvas()?.containerEl(); as container) {
                            <map-builder-minimap [container]="container" />
                        }
                    </main>

                    <!-- Right sidebar -->
                    <aside
                        class="bg-base-100 border-base-300 flex w-80 shrink-0 flex-col border-l"
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
                </div>

                <!-- Status bar -->
                <footer
                    class="bg-base-100 border-base-300 text-base-content/60 flex shrink-0 items-center gap-4 border-t px-3 py-1 text-xs"
                >
                    <span>{{ state.objects().length }} objects</span>
                    <span>
                        {{ state.canvas_width() }} ×
                        {{ state.canvas_height() }}
                    </span>
                    @if (canvas()?.cursor_coords(); as coords) {
                        <span>{{ coords.x }}, {{ coords.y }}</span>
                    }
                    @if (state.multi_select().length; as count) {
                        <span class="text-primary font-semibold">
                            {{ count }} selected
                        </span>
                    }
                    @if (state.placing(); as placing) {
                        <span class="text-primary font-semibold">
                            Click to place {{ placing.id }} (Esc to cancel)
                        </span>
                    }
                    <span class="ml-auto">
                        @if (state.dirty()) {
                            Unsaved changes
                        } @else if (state.last_saved(); as saved) {
                            Saved {{ savedAt(saved) }}
                        }
                    </span>
                </footer>
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
        RouterLink,
        ToastsComponent,
        ValidationPanelComponent,
    ],
})
export class EditorComponent {
    public readonly state = inject(EditorStateService);
    private readonly _route = inject(ActivatedRoute);

    public readonly canvas = viewChild(CanvasComponent);

    public readonly tools = TOOLS;
    public readonly left_tab = signal<'layers' | 'objects'>('layers');

    public readonly right_tabs = [
        { id: 'properties' as const, label: 'Props' },
        { id: 'label' as const, label: 'Label' },
        { id: 'validate' as const, label: 'Check' },
        { id: 'preview' as const, label: 'Preview' },
        { id: 'publish' as const, label: 'Publish' },
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

    public readonly savedAt = (date: Date) => date.toLocaleTimeString();

    constructor() {
        const id = this._route.snapshot.paramMap.get('floorplan_id') ?? '';
        this.state.load(id);
    }

    public pickTool(tool: Tool) {
        this.canvas()?.cancelDrawing();
        this.state.setTool(tool);
    }

    public scrollTo(object: MapObject) {
        void object;
        // ponytail: selection alone is enough to find an object while the
        // canvas fits the viewport. Add scroll-into-view when maps outgrow it.
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
        if (mod && event.key.toLowerCase() === 'd') {
            event.preventDefault();
            const selected = this.state.selected_id();
            if (selected) this.state.duplicateObject(selected);
            return;
        }
        if (mod) return;

        if (event.key === 'Escape') {
            this.state.select(null);
            this.state.clearMultiSelect();
            this.state.cancelPlacing();
            this.canvas()?.cancelDrawing();
            if (this.state.active_tool() === 'wall')
                this.state.setTool('select');
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
            case 'g':
                this.state.toggleGrid();
                break;
        }
    }
}
