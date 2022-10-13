import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { OrganisationService } from '../organisation/organisation.service';
import { Asset } from './assets.service';

@Component({
    selector: 'asset-modal',
    template: `
        <div
            class="absolute inset-0 bg-white dark:bg-neutral-600 dark:text-white flex flex-col"
        >
            <header
                class="w-full bg-blue-300 dark:bg-neutral-700 border-b border-gray-200 dark:border-neutral-500"
            >
                <div class="mx-auto w-[640px] relative p-4 text-center">
                    <div class="font-medium">
                        {{ form.value.id ? 'Edit' : 'New' }} Asset
                    </div>
                    <button
                        mat-icon-button
                        mat-dialog-close
                        class="absolute top-1/2 right-0 -translate-y-1/2"
                        *ngIf="!loading"
                    >
                        <app-icon>close</app-icon>
                    </button>
                </div>
            </header>
            <ng-container *ngIf="!loading; else load_state">
                <main
                    class="mx-auto w-[640px] p-4 flex-1 h-1/2 overflow-auto"
                    [formGroup]="form"
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
                                <mat-option
                                    *ngFor="let item of building_list | async"
                                    [value]="item.id"
                                >
                                    {{ item.display_name || item.name }}
                                </mat-option>
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
                            <mat-hint>
                                Brand of the asset
                            </mat-hint>
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
                            <mat-hint>
                                Barcode of the asset
                            </mat-hint>
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
                    <div class="w-full" *ngIf="form.value.remind_returns">
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
                                Number of hours after the booking to remind user to return assets
                            </mat-hint>
                            <mat-error>Reminder delay is required</mat-error>
                        </mat-form-field>
                    </div>
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
                    class="w-full bg-blue-300 dark:bg-neutral-700 border-t border-gray-200 dark:border-neutral-500"
                >
                    <div class="mx-auto w-[640px] relative p-4">
                        <button mat-button (click)="save()" class="w-32">
                            Save
                        </button>
                    </div>
                </footer>
            </ng-container>
        </div>
        <ng-template #load_state>
            <div class="mx-auto w-[640px] p-4 flex-1 h-1/2">
                <mat-spinner></mat-spinner>
                <p>Saving asset data...</p>
            </div>
        </ng-template>
    `,
    styles: [``],
})
export class AssetModalComponent {
    @Output() public readonly onSave = new EventEmitter<Partial<Asset>>();
    public loading = false;
    public addOnBlur = true;

    public readonly separatorKeysCodes = [ENTER, COMMA] as const;
    public readonly building_list = this._org.buildings;
    public readonly level_list = this._org.levels;
    public readonly form = new FormGroup({
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

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private _data: Asset,
        private _org: OrganisationService
    ) {
        this.form.patchValue(this._data as any);
    }

    public save() {
        this.form.markAllAsTouched();
        if (!this.form.valid) return;
        this.loading = true;
        this.onSave.emit(this.form.getRawValue() as any);
    }
}
