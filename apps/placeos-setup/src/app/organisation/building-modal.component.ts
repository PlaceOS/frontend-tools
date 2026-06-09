import { Component, inject, output, signal } from '@angular/core';
import {
    FormControl,
    FormGroup,
    Validators,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';

import { Building } from './organisation.service';
import { COUNTRIES } from '../data/country';
import { CURRENCIES } from '../data/currency';
import { MatIconButton, MatButton } from '@angular/material/button';
import { IconComponent } from '../../../../../libs/components/src/lib/icon.component';
import { MatFormField, MatHint, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
    selector: 'org-building-modal',
    template: `
        <div
            class="absolute inset-0 bg-white dark:bg-neutral-600 dark:text-white flex flex-col"
        >
            <header
                class="w-full bg-blue-300 dark:bg-neutral-700 border-b border-gray-200 dark:border-neutral-500"
            >
                <div
                    class="mx-auto w-[640px] max-w-full relative p-4 text-center"
                >
                    <div class="font-medium">
                        {{ form.value.id ? 'Edit' : 'New' }} Building
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
                class="mx-auto w-[640px] max-w-full p-4 flex-1 h-1/2 overflow-auto"
                [formGroup]="form"
            >
                <div class="w-full">
                    <label for="display-name">Display Name</label>
                    <mat-form-field appearance="outline" class="w-full">
                        <input
                            matInput
                            name="display-name"
                            formControlName="display_name"
                            placeholder="Building Display Name"
                        />
                        <mat-hint>
                            Name that will be displayed to users
                        </mat-hint>
                        <mat-error>Display name is required</mat-error>
                    </mat-form-field>
                </div>
                <div class="w-full">
                    <label for="name"
                        >Name <span class="text-pending">*</span></label
                    >
                    <mat-form-field appearance="outline" class="w-full">
                        <input
                            matInput
                            name="name"
                            formControlName="name"
                            placeholder="Building Name"
                        />
                        <mat-hint>
                            Organisational name for the building
                        </mat-hint>
                        <mat-error>Name is required</mat-error>
                    </mat-form-field>
                </div>
                <div class="w-full">
                    <label for="country">Country</label>
                    <mat-form-field appearance="outline" class="w-full">
                        <mat-select
                            name="country"
                            formControlName="country"
                            placeholder="Building Country"
                        >
                            @for (item of country_list; track item) {
                            <mat-option [value]="item.name">
                                {{ item.name }}
                            </mat-option>
                            }
                        </mat-select>
                        <mat-hint>
                            Country that the building resides in
                        </mat-hint>
                        <mat-error>Country is required</mat-error>
                    </mat-form-field>
                </div>
                <div class="w-full">
                    <label for="city-address">City</label>
                    <mat-form-field appearance="outline" class="w-full">
                        <input
                            matInput
                            name="city-address"
                            formControlName="city"
                            placeholder="Building City"
                        />
                        <mat-hint> City that the building resides in </mat-hint>
                        <mat-error>City is required</mat-error>
                    </mat-form-field>
                </div>
                <div class="w-full">
                    <label for="address">Address</label>
                    <mat-form-field appearance="outline" class="w-full">
                        <input
                            matInput
                            name="address"
                            formControlName="address"
                            placeholder="Building Address"
                        />
                        <mat-hint>
                            Address within the city that the building resides at
                        </mat-hint>
                        <mat-error>Address is required</mat-error>
                    </mat-form-field>
                </div>
                <div class="w-full">
                    <label for="currency">Currency</label>
                    <mat-form-field appearance="outline" class="w-full">
                        <mat-select
                            name="currency"
                            formControlName="currency"
                            placeholder="Building Currency"
                        >
                            @for (item of currency_list; track item) {
                            <mat-option [value]="item.code">
                                {{ item.name }} ({{ item.symbol_native }
                            </mat-option>
                            }
                        </mat-select>
                        <mat-hint>
                            Currency that transactions are resolved in within
                            the building
                        </mat-hint>
                        <mat-error>Currency is required</mat-error>
                    </mat-form-field>
                </div>
                <div class="w-full py-2">
                    <mat-checkbox
                        name="visitors"
                        formControlName="allow_visitors"
                    >
                        Are visitors allow to the building?
                    </mat-checkbox>
                </div>
                <div class="w-full py-2">
                    <mat-checkbox
                        name="catering"
                        formControlName="catering_available"
                    >
                        Is catering available in the building?
                    </mat-checkbox>
                </div>
            </main>
            <footer
                class="w-full bg-blue-300 dark:bg-neutral-700 border-t border-gray-200 dark:border-neutral-500"
            >
                <div class="mx-auto w-[640px] max-w-full relative p-4">
                    <button mat-button (click)="save()" class="w-32">
                        Save
                    </button>
                </div>
            </footer>
            } @else {
            <div class="mx-auto w-[640px] p-4 flex-1 h-1/2">
                <mat-spinner />
                <p>Saving building data...</p>
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
export class OrganisationBuildingModalComponent {
    private _bld = inject<Building>(MAT_DIALOG_DATA);

    public readonly onSave = output<Partial<Building>>();
    public readonly loading = signal(false);

    public readonly form = new FormGroup({
        id: new FormControl(this._bld?.id ?? ''),
        display_name: new FormControl(this._bld?.display_name ?? ''),
        name: new FormControl(this._bld?.name ?? '', [Validators.required]),
        country: new FormControl(this._bld?.country ?? ''),
        city: new FormControl(this._bld?.city ?? ''),
        address: new FormControl(this._bld?.address ?? ''),
        currency: new FormControl(this._bld?.currency ?? 'USD'),
        allow_visitors: new FormControl(this._bld?.allow_visitors ?? false),
        catering_available: new FormControl(
            this._bld?.catering_available ?? false
        ),
    });
    public readonly country_list = COUNTRIES;
    public readonly currency_list = CURRENCIES;

    public save() {
        this.form.markAllAsTouched();
        if (!this.form.valid) return;
        this.loading.set(true);
        this.onSave.emit(this.form.getRawValue());
    }
}
