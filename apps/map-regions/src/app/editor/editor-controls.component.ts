import { Component } from '@angular/core';
import { EditorStateService } from './editor-state.service';

@Component({
    selector: 'editor-controls',
    template: `
        <div class="flex flex-col items-center p-4 space-y-4 h-full">
            <div class="w-full bg-white rounded p-2 shadow">
                <h3>Map Settings</h3>
                <label>Width:</label>
                <mat-form-field appearance="outline" class="w-full h-12">
                    <input matInput type="number" placeholder="Map Width" />
                </mat-form-field>
                <label>Height:</label>
                <mat-form-field appearance="outline" class="w-full h-12">
                    <input matInput type="number" placeholder="Map Height" />
                </mat-form-field>
            </div>
            <div class="w-full bg-white rounded shadow flex-1">
                <button mat-button class="clear w-full m-0" (click)="newRegion()">
                    <div class="flex items-center">
                        <app-icon class="mr-4">add</app-icon>
                        New Region
                    </div>
                </button>
                <div
                    *ngIf="(regions | async)?.length; else empty_state"
                    class="border-t border-gray-300"
                >
                    <div
                        *ngFor="let region of regions | async; let i = index"
                        class="p-2 border-b border-gray-100 hover:bg-gray-100 flex items-center space-x-1 cursor-pointer"
                        (click)="setActiveRegion(region)"
                        matRipple
                    >
                        <div
                            counter
                            class="w-6 h-6 flex items-center justify-center rounded-full"
                            [class.bg-success]="
                                (active_region | async)?.id === region.id
                            "
                            [class.text-white]="
                                (active_region | async)?.id === region.id
                            "
                        >
                            {{ i + 1 }}
                        </div>
                        <mat-form-field appearance="outline" class="w-16">
                            <input
                                matInput
                                type="number"
                                [(ngModel)]="region.capacity"
                                placeholder="Capacity"
                            />
                        </mat-form-field>
                        <input type="color" [(ngModel)]="region.color" />
                        <mat-form-field appearance="outline" class="flex-1">
                            <input
                                matInput
                                type="text"
                                placeholder="Region ID"
                                [(ngModel)]="region.name"
                            />
                        </mat-form-field>
                        <button mat-icon-button (click)="removeRegion(region); $event.stopPropagation()">
                            <app-icon>close</app-icon>
                        </button>
                    </div>
                    <div></div>
                </div>
            </div>

            <div class="w-full bg-white rounded shadow">
                <button mat-button class="clear w-full m-0" (click)="saveMetadata()">
                    <div class="flex items-center">
                        <app-icon class="mr-4">save_alt</app-icon>
                        {{ (embeded | async) ? 'Save' : 'Download' }} Metadata
                    </div>
                </button>
            </div>

            <div class="w-full bg-white rounded shadow">
                <button mat-button class="clear w-full m-0" (click)="copyMetadata()">
                    <div class="flex items-center">
                        <app-icon class="mr-4">content_copy</app-icon>
                        Copy Metadata
                    </div>
                </button>
            </div>
        </div>
        <ng-template #empty_state>
            <p class="p-4 border-t border-gray-300 text-center">No regions for map</p>
        </ng-template>
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
                transition: color 200ms, background-color 200ms;
            }
        `,
    ],
})
export class EditorControlsComponent {
    /** Map regions for active map URL */
    public readonly regions = this._state.regions;
    /** Map regions for active map URL */
    public readonly embeded = this._state.embeded;
    /** Map regions for active map URL */
    public readonly active_region = this._state.active_region;

    public readonly setActiveRegion = (r) => this._state.setActiveRegion(r);
    public readonly newRegion = () => this._state.newRegion();
    public readonly removeRegion = (r) => this._state.removeRegion(r);
    public readonly saveMetadata = () => this._state.saveMetadata();
    public readonly copyMetadata = () => this._state.copyMetadata();

    constructor(private _state: EditorStateService) {}
}
