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
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { IconComponent } from '../../../../../libs/components/src/lib/icon.component';
import { OrganisationService } from '../organisation/organisation.service';
import { Asset } from './assets.service';

@Component({
    selector: 'asset-modal',
    template: `
        <div
            class="absolute inset-0 flex flex-col bg-white dark:bg-neutral-600 dark:text-white"
        >
            <header
                class="w-full border-b border-gray-200 bg-blue-300 dark:border-neutral-500 dark:bg-neutral-700"
            >
                <div class="relative mx-auto w-[640px] p-4 text-center">
                    <div class="font-medium">
                        {{ form().value.id ? 'Edit' : 'New' }} Asset
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
                                Organisational name for the asset
                            </mat-hint>
                            <mat-error>Name is required</mat-error>
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
                        <label for="brand">Brand</label>
                        <mat-form-field appearance="outline" class="w-full">
                            <input
                                matInput
                                name="brand"
                                formControlName="brand"
                                placeholder="Brand"
                            />
                            <mat-hint> Brand of the asset </mat-hint>
                            <mat-error>Brand is required</mat-error>
                        </mat-form-field>
                    </div>
                    <div class="w-full">
                        <label for="barcode">Barcode</label>
                        <mat-form-field appearance="outline" class="w-full">
                            <input
                                matInput
                                name="barcode"
                                formControlName="barcode"
                                placeholder="Barcode"
                            />
                            <mat-hint> Barcode of the asset </mat-hint>
                            <mat-error>Barcode is required</mat-error>
                        </mat-form-field>
                    </div>
                    <div class="w-full">
                        <label for="category">Category</label>
                        <mat-form-field appearance="outline" class="w-full">
                            <input
                                matInput
                                name="category"
                                formControlName="category"
                                placeholder="Category"
                            />
                            <mat-hint>
                                Organisational category of the asset
                            </mat-hint>
                            <mat-error>Category is required</mat-error>
                        </mat-form-field>
                    </div>
                    <div class="w-full">
                        <label for="purchase-date">Purchase Date</label>
                        <mat-form-field appearance="outline" class="w-full">
                            <input
                                matInput
                                name="purchase-date"
                                formControlName="purchase_date"
                                placeholder="Purchase Date"
                            />
                            <mat-hint>
                                Date of purchase for the asset
                            </mat-hint>
                            <mat-error>Date of Purchase is required</mat-error>
                        </mat-form-field>
                    </div>
                    <div class="w-full">
                        <label for="good-until">Good Until</label>
                        <mat-form-field appearance="outline" class="w-full">
                            <input
                                matInput
                                name="good-until"
                                formControlName="good_until"
                                placeholder="Good Until date"
                            />
                            <mat-hint>
                                Date that the asset is good to use until
                            </mat-hint>
                            <mat-error>Good until is required</mat-error>
                        </mat-form-field>
                    </div>
                    <div class="w-full py-2">
                        <mat-checkbox
                            name="consumable"
                            formControlName="consumable"
                        >
                            Is the asset consumable?
                        </mat-checkbox>
                    </div>
                    <div class="w-full py-2">
                        <mat-checkbox
                            name="remind-returns"
                            formControlName="remind_returns"
                        >
                            Send email reminders for returning asset?
                        </mat-checkbox>
                    </div>
                    @if (form().value.remind_returns) {
                        <div class="w-full">
                            <label for="max-recurrences">Reminder Delay</label>
                            <mat-form-field appearance="outline" class="w-full">
                                <input
                                    matInput
                                    name="reminder-delay"
                                    type="number"
                                    formControlName="reminder_delay"
                                    placeholder="Reminder delay"
                                />
                                <mat-hint>
                                    Number of hours after the booking to remind
                                    user to return assets
                                </mat-hint>
                                <mat-error
                                    >Reminder delay is required</mat-error
                                >
                            </mat-form-field>
                        </div>
                    }
                    <div class="w-full py-2">
                        <mat-checkbox
                            name="available-for-desks"
                            formControlName="available_for_desks"
                        >
                            Should asset be available when booking desks?
                        </mat-checkbox>
                    </div>
                    <div class="w-full py-2">
                        <mat-checkbox
                            name="available-for-spaces"
                            formControlName="available_for_spaces"
                        >
                            Should asset be available when booking rooms?
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
                    <p>Saving asset data...</p>
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
        MatCheckbox,
        MatButton,
    ],
})
export class AssetModalComponent {
    private _data = inject<Asset>(MAT_DIALOG_DATA);
    private _org = inject(OrganisationService);

    public readonly onSave = output<Partial<Asset>>();
    public readonly loading = signal(false);
    public addOnBlur = true;

    public readonly separatorKeysCodes = [ENTER, COMMA] as const;
    public readonly building_list = this._org.buildings;
    public readonly level_list = this._org.levels;
    public readonly form = signal(
        new FormGroup({
            id: new FormControl(''),
            building_id: new FormControl('', [Validators.required]),
            name: new FormControl('', [Validators.required]),
            brand: new FormControl(''),
            barcode: new FormControl(''),
            category: new FormControl(''),
            purchase_date: new FormControl(''),
            good_until: new FormControl(''),
            consumable: new FormControl(false),
            quantity: new FormControl(1),
            remind_returns: new FormControl(false),
            reminder_delay: new FormControl(24),
            available_for_desks: new FormControl(false),
            available_for_spaces: new FormControl(false),
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
