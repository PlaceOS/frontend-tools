import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatRipple } from '@angular/material/core';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompactCounterComponent } from '@placeos-tools/components';
import { IconComponent } from '../../../../../libs/components/src/lib/icon.component';
import { EditorStateService } from './editor-state.service';

@Component({
    selector: 'editor-options',
    template: `
        <div
            class="bg-base-100 divide-base-200 border-base-300 flex h-full flex-col items-center divide-y border-r shadow"
        >
            <div class="w-full p-4">
                <div
                    class="bg-base-300/50 mb-2! w-full rounded px-4 py-3 text-lg font-medium shadow"
                >
                    Map Settings
                </div>
                <div class="flex items-center space-x-2 px-2">
                    <div class="w-px flex-1">
                        <label class="mb-2">Width:</label>
                        <compact-counter
                            placeholder="Map Width"
                            [ngModel]="width()"
                            (ngModelChange)="setWidth($event)"
                        />
                    </div>
                    <div class="w-px flex-1">
                        <label class="mb-2">Height:</label>
                        <compact-counter
                            placeholder="Map Height"
                            [ngModel]="height()"
                            (ngModelChange)="setHeight($event)"
                        />
                    </div>
                </div>
            </div>
            <div class="flex h-1/2 w-full flex-1 flex-col p-4">
                <div
                    class="bg-base-300/50 mb-2 flex items-center justify-center gap-1 rounded p-2 shadow"
                >
                    <div class="flex-1 px-2 text-lg font-medium">Regions</div>
                    <button
                        icon
                        default
                        matRipple
                        matTooltip="New Region"
                        (click)="newRegion()"
                    >
                        <icon>add</icon>
                    </button>
                    <button
                        icon
                        default
                        matRipple
                        [matTooltip]="
                            (embeded() ? 'Save' : 'Download') + ' Metadata'
                        "
                        (click)="saveMetadata()"
                    >
                        <icon>save_alt</icon>
                    </button>
                    <button
                        icon
                        default
                        matRipple
                        matTooltip="Copy Metadata"
                        (click)="copyMetadata()"
                    >
                        <icon>content_copy</icon>
                    </button>
                </div>
                <div
                    class="flex h-[50vh] w-full flex-1 flex-col gap-2 overflow-auto"
                >
                    @if (regions()?.length) {
                        @for (
                            region of regions();
                            track region.id;
                            let i = $index
                        ) {
                            <div
                                class="hover:bg-base-200 even:bg-base-200 border-base-300 flex cursor-pointer items-center gap-2 rounded border p-1"
                                (click)="setActiveRegion(region)"
                                [class.!border-primary]="
                                    region.id === active_region()?.id
                                "
                                matRipple
                            >
                                <div
                                    class="border-base-300 relative h-12 w-6 rounded-md border"
                                    [style.background]="region.color"
                                >
                                    <input
                                        type="color"
                                        class="absolute inset-0 opacity-0"
                                        [(ngModel)]="region.color"
                                    />
                                </div>
                                <compact-counter
                                    [(ngModel)]="region.capacity"
                                    placeholder="Capacity"
                                />
                                <mat-form-field
                                    appearance="outline"
                                    class="flex-1"
                                >
                                    <input
                                        matInput
                                        type="text"
                                        placeholder="Region ID"
                                        [(ngModel)]="region.name"
                                    />
                                </mat-form-field>
                                <button
                                    icon
                                    default
                                    (click)="
                                        removeRegion(region);
                                        $event.stopPropagation()
                                    "
                                    matTooltip="Remove Region"
                                >
                                    <icon>close</icon>
                                </button>
                            </div>
                        }
                    } @else {
                        <p
                            class="bg-base-200 flex h-32 items-center justify-center rounded p-8"
                        >
                            No regions for map
                        </p>
                    }
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            [type='color'] {
                width: 1.5rem;
                min-width: 1.5rem;
            }
            mat-form-field {
                min-width: 4rem;
                height: 3rem;
            }
            [counter] {
                transition:
                    color 200ms,
                    background-color 200ms;
            }
        `,
    ],
    imports: [
        MatFormField,
        MatInput,
        FormsModule,
        MatRipple,
        IconComponent,
        MatTooltipModule,
        CompactCounterComponent,
    ],
})
export class EditorOptionsComponent {
    private _state = inject(EditorStateService);

    /** Map regions for active map URL */
    public readonly regions = this._state.regions;
    /** Map regions for active map URL */
    public readonly embeded = this._state.embeded;
    /** Map regions for active map URL */
    public readonly active_region = this._state.active_region;
    /** Map regions for active map URL */
    public readonly height = this._state.height;
    /** Map regions for active map URL */
    public readonly width = this._state.width;

    public readonly setActiveRegion = (r) => this._state.setActiveRegion(r);
    public readonly newRegion = () => this._state.newRegion();
    public readonly removeRegion = (r) => this._state.removeRegion(r);
    public readonly setHeight = (h) => this._state.setHeight(h);
    public readonly setWidth = (w) => this._state.setWidth(w);
    public readonly saveMetadata = () => this._state.saveMetadata();
    public readonly copyMetadata = () => this._state.copyMetadata();
}
