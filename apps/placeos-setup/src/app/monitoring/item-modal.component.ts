import { Component, inject, output, signal } from '@angular/core';
import {
    FormControl,
    FormGroup,
    Validators,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';

import { OrganisationService } from '../organisation/organisation.service';
import { BuildingMonitoring } from './monitoring.service';
import { MatIconButton, MatButton } from '@angular/material/button';
import { IconComponent } from '../../../../../libs/components/src/lib/icon.component';
import { MatFormField, MatHint, MatError } from '@angular/material/form-field';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'monitoring-item-modal',
    template: `
        <div
            class="absolute inset-0 bg-white dark:bg-neutral-600 dark:text-white flex flex-col"
        >
            <header
                class="w-full bg-blue-300 dark:bg-neutral-700 border-b border-gray-200 dark:border-neutral-500"
            >
                <div class="mx-auto w-[640px] relative p-4 text-center">
                    <div class="font-medium">
                        {{ form.value.id ? 'Edit' : 'New' }} Monitoring Region
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
                class="mx-auto w-[640px] p-4 flex-1 h-1/2 overflow-auto"
                [formGroup]="form"
            >
                <div class="w-full">
                    <label for="building">Building</label>
                    <mat-form-field appearance="outline" class="w-full">
                        <mat-select
                            name="building"
                            formControlName="id"
                            placeholder="Building"
                        >
                            @for (item of building_list | async; track item) {
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
                            @for (item of level_list | async; track item) {
                            <mat-option [value]="item.id">
                                {{ item.display_name || item.name }}
                            </mat-option>
                            }
                        </mat-select>
                        <mat-hint>
                            Building Level that the monitoring resides in
                        </mat-hint>
                        <mat-error>Building Level is required</mat-error>
                    </mat-form-field>
                </div>
                <div class="w-full">
                    <label for="sensor-brand">Sensor Brand</label>
                    <mat-form-field appearance="outline" class="w-full">
                        <input
                            matInput
                            name="sensor-brand"
                            formControlName="sensor_brand"
                            placeholder="Sensor Brand"
                        />
                        <mat-hint>
                            Brand of sensors that are used in the monitoring
                        </mat-hint>
                        <mat-error>Sensor brand is required</mat-error>
                    </mat-form-field>
                </div>
                <div class="w-full py-2">
                    <mat-checkbox
                        name="visitors"
                        formControlName="sensor_locations_available"
                    >
                        Are sensor locations available in the map markup?
                    </mat-checkbox>
                </div>
                <div class="w-full py-2">
                    <mat-checkbox
                        name="requires-approval"
                        formControlName="show_on_map"
                    >
                        Should sensor data be display to users?
                    </mat-checkbox>
                </div>
                <div class="w-full py-2">
                    <mat-checkbox
                        name="auto-release"
                        formControlName="show_in_analytics"
                    >
                        Should sensor data be displayed in analytics?
                    </mat-checkbox>
                </div>
            </main>
            <footer
                class="w-full bg-blue-300 dark:bg-neutral-700 border-t border-gray-200 dark:border-neutral-500"
            >
                <div class="mx-auto w-[640px] relative p-4">
                    <button mat-button (click)="save()" class="w-32">
                        Save
                    </button>
                </div>
            </footer>
            } @else {
            <div class="mx-auto w-[640px] p-4 flex-1 h-1/2">
                <mat-spinner />
                <p>Saving monitoring data...</p>
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
        MatInput,
        MatCheckbox,
        MatButton,
        AsyncPipe,
    ],
})
export class MonitoringItemModalComponent {
    private _data = inject<BuildingMonitoring>(MAT_DIALOG_DATA);
    private _org = inject(OrganisationService);

    public readonly onSave = output<Partial<BuildingMonitoring>>();
    public readonly loading = signal(false);

    public readonly building_list = this._org.buildings;
    public readonly level_list = this._org.levels;
    public readonly form = new FormGroup({
        id: new FormControl(''),
        level_id: new FormControl('', [Validators.required]),
        required: new FormControl(true),
        sensor_brand: new FormControl(''),
        sensor_locations_available: new FormControl(false),
        show_on_map: new FormControl(false),
        show_in_analytics: new FormControl(false),
    });

    constructor() {
        this.form.patchValue(this._data as any);
    }

    public save() {
        this.form.markAllAsTouched();
        if (!this.form.valid) return;
        this.loading.set(true);
        this.onSave.emit(this.form.getRawValue() as any);
    }
}
