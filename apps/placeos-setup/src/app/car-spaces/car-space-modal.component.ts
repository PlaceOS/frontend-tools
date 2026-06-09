import { Component, inject, output, signal } from '@angular/core';
import {
    FormControl,
    FormGroup,
    Validators,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import {
    MatChipInputEvent,
    MatChip,
    MatChipRemove,
    MatChipInput,
} from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';

import { OrganisationService } from '../organisation/organisation.service';
import { CarSpace } from './car-spaces.service';
import { MatIconButton, MatButton } from '@angular/material/button';
import { IconComponent } from '../../../../../libs/components/src/lib/icon.component';
import { MatFormField, MatHint, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatCheckbox } from '@angular/material/checkbox';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'car-space-modal',
    template: `
        <div
            class="absolute inset-0 bg-white dark:bg-neutral-600 dark:text-white flex flex-col"
        >
            <header
                class="w-full bg-blue-300 dark:bg-neutral-700 border-b border-gray-200 dark:border-neutral-500"
            >
                <div class="mx-auto w-[640px] relative p-4 text-center">
                    <div class="font-medium">
                        {{ form.value.id ? 'Edit' : 'New' }} Car Space
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
                    <label for="car-space-id">Car Space ID</label>
                    <mat-form-field appearance="outline" class="w-full">
                        <input
                            matInput
                            name="car-space-id"
                            formControlName="map_id"
                            placeholder="Car Space ID"
                        />
                        <mat-hint> Map ID associated with the map </mat-hint>
                        <mat-error>Car Space ID is required</mat-error>
                    </mat-form-field>
                </div>
                <div class="w-full">
                    <label for="name">
                        Name <span class="text-pending">*</span>
                    </label>
                    <mat-form-field appearance="outline" class="w-full">
                        <input
                            matInput
                            name="name"
                            formControlName="name"
                            placeholder="Level Name"
                        />
                        <mat-hint>
                            Organisational name for the Car Space
                        </mat-hint>
                        <mat-error>Name is required</mat-error>
                    </mat-form-field>
                </div>
                <div class="w-full">
                    <label for="vehicle-type">Vehicle Type</label>
                    <mat-form-field appearance="outline" class="w-full">
                        <mat-select
                            name="vehicle-type"
                            formControlName="type"
                            placeholder="Vehicle Type"
                        >
                            <mat-option value="Boke">Bike</mat-option>
                            <mat-option value="Car">Car</mat-option>
                            <mat-option value="Van">Van</mat-option>
                            <mat-option value="Other">Other</mat-option>
                        </mat-select>
                        <mat-hint>
                            Type of vehicle that the space can accomadate
                        </mat-hint>
                        <mat-error>Vehicle type is required</mat-error>
                    </mat-form-field>
                </div>
                <div class="w-full">
                    <label for="building">Building</label>
                    <mat-form-field appearance="outline" class="w-full">
                        <mat-select
                            name="building"
                            formControlName="building_id"
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
                            Building Level that the Car Space resides in
                        </mat-hint>
                        <mat-error>Building Level is required</mat-error>
                    </mat-form-field>
                </div>
                <div class="w-full">
                    <label for="display-name">Space Features</label>
                    <mat-form-field appearance="outline" class="w-full">
                        <mat-chip-list
                            #featureList
                            aria-label="Car Space Features"
                        >
                            @for (item of form.value.features; track item) {
                            <mat-chip
                                (removed)="remove(item, form.get('features'))"
                            >
                                {{ item }}
                                <button matChipRemove>
                                    <app-icon>cancel</app-icon>
                                </button>
                            </mat-chip>
                            }
                            <input
                                placeholder="New feature..."
                                [matChipInputFor]="featureList"
                                [matChipInputSeparatorKeyCodes]="
                                    separatorKeysCodes
                                "
                                [matChipInputAddOnBlur]="addOnBlur"
                                (matChipInputTokenEnd)="
                                    add($event, form.get('features'))
                                "
                            />
                        </mat-chip-list>
                        <mat-hint>
                            Resources in the Car Space that are available for
                            users.
                        </mat-hint>
                        <mat-error>Display name is required</mat-error>
                    </mat-form-field>
                </div>
                <div class="w-full">
                    <label for="whi">Whitelist User Groups</label>
                    <mat-form-field appearance="outline" class="w-full">
                        <mat-chip-list
                            #groupList
                            aria-label="Whitelist User Groups"
                        >
                            @for ( item of form.value.whitelist_groups ; track
                            item) {
                            <mat-chip
                                (removed)="
                                    remove(item, form.get('whitelist_groups'))
                                "
                            >
                                {{ item }}
                                <button matChipRemove>
                                    <app-icon>cancel</app-icon>
                                </button>
                            </mat-chip>
                            }
                            <input
                                placeholder="New group..."
                                [matChipInputFor]="groupList"
                                [matChipInputSeparatorKeyCodes]="
                                    separatorKeysCodes
                                "
                                [matChipInputAddOnBlur]="addOnBlur"
                                (matChipInputTokenEnd)="
                                    add($event, form.get('whitelist_groups'))
                                "
                            />
                        </mat-chip-list>
                        <mat-hint>
                            Users groups to limit access to this car space
                        </mat-hint>
                        <mat-error>Display name is required</mat-error>
                    </mat-form-field>
                </div>
                <div class="w-full py-2">
                    <mat-checkbox name="visitors" formControlName="bookable">
                        Is this car space bookable?
                    </mat-checkbox>
                </div>
                <div class="w-full py-2">
                    <mat-checkbox
                        name="plate-detection"
                        formControlName="plate_detection"
                    >
                        Is there a plate detection system available for the
                        space?
                    </mat-checkbox>
                </div>
                <div class="w-full py-2">
                    <mat-checkbox
                        name="auto-release"
                        formControlName="auto_release"
                    >
                        Should bookings be released if not checked into?
                    </mat-checkbox>
                </div>
                <div class="w-full py-2">
                    <mat-checkbox
                        name="recurrence"
                        formControlName="recurrence"
                    >
                        Should recurring bookings be allowed in this car space?
                    </mat-checkbox>
                </div>
                @if (form.value.recurrence) {
                <div class="w-full">
                    <label for="max-recurrences">Max Recurrences</label>
                    <mat-form-field appearance="outline" class="w-full">
                        <input
                            matInput
                            name="max-recurrences"
                            type="number"
                            formControlName="max_recurrence"
                            placeholder="Max Recurrences"
                        />
                        <mat-hint>
                            Number of recurrence instances allow for a booking
                        </mat-hint>
                        <mat-error>Max recurrences is required</mat-error>
                    </mat-form-field>
                </div>
                }
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
                <p>Saving car space data...</p>
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
        MatInput,
        MatHint,
        MatError,
        MatSelect,
        MatOption,
        MatChip,
        MatChipRemove,
        MatChipInput,
        MatCheckbox,
        MatButton,
        AsyncPipe,
    ],
})
export class CarSpaceModalComponent {
    private _data = inject<CarSpace>(MAT_DIALOG_DATA);
    private _org = inject(OrganisationService);

    public readonly onSave = output<Partial<CarSpace>>();
    public readonly loading = signal(false);
    public addOnBlur = true;

    public readonly separatorKeysCodes = [ENTER, COMMA] as const;
    public readonly building_list = this._org.buildings;
    public readonly level_list = this._org.levels;
    public readonly form = new FormGroup({
        id: new FormControl(''),
        map_id: new FormControl('', [Validators.required]),
        building_id: new FormControl('', [Validators.required]),
        level_id: new FormControl('', [Validators.required]),
        name: new FormControl('', [Validators.required]),
        type: new FormControl(''),
        features: new FormControl([]),
        whitelist_groups: new FormControl([]),
        bookable: new FormControl(false),
        plate_detection: new FormControl(false),
        auto_release: new FormControl(false),
        auto_release_delay: new FormControl(15),
        recurrence: new FormControl(false),
        max_recurrence: new FormControl(0),
    });

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
        this.form.patchValue(this._data as any);
    }

    public save() {
        this.form.markAllAsTouched();
        if (!this.form.valid) return;
        this.loading.set(true);
        this.onSave.emit(this.form.getRawValue() as any);
    }
}
