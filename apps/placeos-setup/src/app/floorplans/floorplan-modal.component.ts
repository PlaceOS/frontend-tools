import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, inject, output, signal } from '@angular/core';
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';

import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';

import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatError, MatFormField, MatHint } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { IconComponent } from '../../../../../libs/components/src/lib/icon.component';
import { OrganisationService } from '../organisation/organisation.service';
import { FloorPlan } from './floorplans.service';

@Component({
    selector: 'floorplan-modal',
    template: `
        <div
            class="absolute inset-0 flex flex-col bg-white dark:bg-neutral-600 dark:text-white"
        >
            <header
                class="w-full border-b border-gray-200 bg-blue-300 dark:border-neutral-500 dark:bg-neutral-700"
            >
                <div class="relative mx-auto w-[640px] p-4 text-center">
                    <div class="font-medium">
                        {{ form().value.id ? 'Edit' : 'New' }} Floor Plan
                    </div>
                    @if (!loading()) {
                        <button
                            mat-icon-button
                            mat-dialog-close
                            class="absolute top-1/2 right-0 -translate-y-1/2"
                        >
                            <app-icon>close</app-icon>
                        </button>
                    }
                </div>
            </header>
            @if (!loading()) {
                <main
                    class="mx-auto h-1/2 w-[640px] flex-1 overflow-auto p-4"
                    [formGroup]="form()"
                >
                    <div class="w-full">
                        <label for="building">Building</label>
                        <mat-form-field appearance="outline" class="w-full">
                            <mat-select
                                name="building"
                                formControlName="building_id"
                                placeholder="Building"
                            >
                                @for (item of building_list(); track item) {
                                    <mat-option [value]="item.id">
                                        {{ item.display_name || item.name }}
                                    </mat-option>
                                }
                            </mat-select>
                            <mat-hint>
                                Building that the level resides in
                            </mat-hint>
                            <mat-error>Building is required</mat-error>
                        </mat-form-field>
                    </div>
                    <div class="w-full">
                        <label for="level">Level</label>
                        <mat-form-field appearance="outline" class="w-full">
                            <mat-select
                                name="level"
                                formControlName="level_id"
                                placeholder="Level"
                            >
                                @for (item of level_list(); track item) {
                                    <mat-option [value]="item.id">
                                        {{ item.display_name || item.name }}
                                    </mat-option>
                                }
                            </mat-select>
                            <mat-hint>
                                Building Level that the floorplan resides in
                            </mat-hint>
                            <mat-error>Building Level is required</mat-error>
                        </mat-form-field>
                    </div>
                    <div class="w-full py-2">
                        <mat-checkbox
                            name="map-available"
                            formControlName="map_available"
                        >
                            Is Map file available as high quaility PDF, JPEG or
                            PNG?
                        </mat-checkbox>
                    </div>
                    <div class="w-full py-2">
                        <mat-checkbox
                            name="features_setup"
                            formControlName="features_setup"
                        >
                            Are fixed points of interest intended to be
                            searchable or bookable identified (rooms, desks,
                            phone booths) setup? Each with an ID that matches
                            the ID in the RoomID/DeskID tabs in this
                            spreadsheet.
                        </mat-checkbox>
                    </div>
                    <div class="w-full py-2">
                        <mat-checkbox
                            name="zones-setup"
                            formControlName="zones_setup"
                        >
                            Are zones setup? This might reflect a neighbourhood
                            (e.g. HR department)
                        </mat-checkbox>
                    </div>
                    <div class="w-full py-2">
                        <mat-checkbox
                            name="sensors-setup"
                            formControlName="sensors_setup"
                        >
                            If environmental sensors are being used, has the
                            locations of environmental sensors been setup?
                        </mat-checkbox>
                    </div>
                </main>
                <footer
                    class="w-full border-t border-gray-200 bg-blue-300 dark:border-neutral-500 dark:bg-neutral-700"
                >
                    <div class="relative mx-auto w-[640px] p-4">
                        <button mat-button (click)="save()" class="w-32">
                            Save
                        </button>
                    </div>
                </footer>
            } @else {
                <div class="mx-auto h-1/2 w-[640px] flex-1 p-4">
                    <mat-spinner />
                    <p>Saving floorplan data...</p>
                </div>
            }
        </div>
    `,
    styles: [``],
    imports: [
        MatIconButton,
        MatDialogClose,
        IconComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormField,
        MatSelect,
        MatOption,
        MatHint,
        MatError,
        MatCheckbox,
        MatButton,
    ],
})
export class FloorPlanModalComponent {
    private _data = inject<FloorPlan>(MAT_DIALOG_DATA);
    private _org = inject(OrganisationService);

    public readonly onSave = output<Partial<FloorPlan>>();
    public readonly loading = signal(false);
    public addOnBlur = true;

    public readonly separatorKeysCodes = [ENTER, COMMA] as const;
    public readonly building_list = this._org.buildings;
    public readonly level_list = this._org.levels;
    public readonly form = signal(
        new FormGroup({
            id: new FormControl(''),
            building_id: new FormControl('', [Validators.required]),
            level_id: new FormControl('', [Validators.required]),
            map_available: new FormControl(false),
            features_setup: new FormControl(false),
            zones_setup: new FormControl(false),
            sensors_setup: new FormControl(false),
        }),
    );

    public add(event: MatChipInputEvent, control: FormControl<string[]>): void {
        const value = (event.value || '').trim();
        if (value) control.value.push(value);
        event.chipInput!.clear();
    }

    public remove(item: string, control: FormControl<string[]>): void {
        const index = control.value.indexOf(item);
        if (index >= 0) control.value.splice(index, 1);
    }

    constructor() {
        this.form().patchValue(this._data as any);
    }

    public save() {
        this.form().markAllAsTouched();
        if (!this.form().valid) return;
        this.loading.set(true);
        this.onSave.emit(this.form().getRawValue() as any);
    }
}
