import { Component, inject, viewChildren } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
    CustomTooltipComponent,
    IconComponent,
} from '@placeos-tools/components';

import { AMENITY_ICONS, DESK_LAYOUTS, FURNITURE_ASSETS } from './constants';
import { EditorStateService } from './editor-state.service';

type PickerKind = 'amenity' | 'furniture' | 'desk-layout';

const LABELS: Record<PickerKind, string> = {
    amenity: 'Amenity',
    furniture: 'Furniture',
    'desk-layout': 'Desk Group',
};

const ICONS: Record<PickerKind, string> = {
    amenity: 'add_location',
    furniture: 'chair',
    'desk-layout': 'grid_view',
};

@Component({
    selector: 'map-builder-asset-picker',
    template: `
        <div class="flex shrink-0 items-center gap-1">
            @for (kind of kinds; track kind) {
                <button
                    customTooltip
                    xPosition="start"
                    [content]="menu"
                    [data]="{ $implicit: kind }"
                    class="border-base-300 flex shrink-0 items-center rounded border p-1.5"
                    [class]="
                        state.placing()?.kind === kind
                            ? 'bg-primary text-primary-content border-primary'
                            : 'bg-base-100 hover:bg-base-200'
                    "
                    [title]="'Place ' + labelFor(kind)"
                >
                    <app-icon class="text-lg">{{ iconFor(kind) }}</app-icon>
                    <app-icon class="text-sm">expand_more</app-icon>
                </button>
            }
        </div>

        <ng-template #menu let-kind>
            <div
                class="bg-base-100 border-base-300 pointer-events-auto mt-1 max-h-80 w-64 overflow-y-auto rounded-lg border p-2 shadow-lg"
            >
                <div class="mb-1 px-1 text-xs font-bold">
                    {{ labelFor(kind) }}
                </div>
                @if (kind === 'desk-layout') {
                    @for (layout of desk_layouts; track layout.id) {
                        <button
                            class="hover:bg-base-200 flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs"
                            (click)="pick(kind, layout.id)"
                        >
                            <span class="font-medium">{{ layout.label }}</span>
                            <span class="text-base-content/60 ml-auto">
                                {{ layout.cols * layout.rows }} desks
                            </span>
                        </button>
                    }
                } @else {
                    <div class="grid grid-cols-2 gap-1">
                        @for (asset of assetsFor(kind); track asset.id) {
                            <button
                                class="hover:bg-base-200 flex items-center gap-1.5 rounded px-1.5 py-1 text-left text-xs"
                                (click)="pick(kind, asset.id)"
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    class="shrink-0"
                                    [innerHTML]="artFor(asset.svg)"
                                ></svg>
                                <span class="truncate">{{ asset.label }}</span>
                            </button>
                        }
                    </div>
                }
            </div>
        </ng-template>
    `,
    imports: [CustomTooltipComponent, IconComponent],
})
export class AssetPickerComponent {
    public readonly state = inject(EditorStateService);
    private readonly _sanitizer = inject(DomSanitizer);

    private readonly _tooltips = viewChildren(CustomTooltipComponent);

    public readonly kinds: PickerKind[] = [
        'amenity',
        'furniture',
        'desk-layout',
    ];
    public readonly desk_layouts = DESK_LAYOUTS;

    public readonly labelFor = (kind: PickerKind) => LABELS[kind];

    public readonly iconFor = (kind: PickerKind) => ICONS[kind];

    public readonly assetsFor = (kind: PickerKind) =>
        kind === 'amenity' ? AMENITY_ICONS : FURNITURE_ASSETS;

    public readonly artFor = (svg: string): SafeHtml =>
        this._sanitizer.bypassSecurityTrustHtml(
            svg.replace(/currentColor/g, '#334155'),
        );

    public pick(kind: PickerKind, id: string) {
        this.state.startPlacing(kind, id);
        for (const tooltip of this._tooltips()) tooltip.close();
    }
}
