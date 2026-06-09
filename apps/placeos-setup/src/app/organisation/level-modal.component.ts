import { Component, computed, inject, output, signal } from '@angular/core';
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';

import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatError, MatFormField, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { IconComponent } from '../../../../../libs/components/src/lib/icon.component';
import { Building, BuildingLevel } from './organisation.service';

@Component({
    selector: 'org-level-modal',
    template: `
        <div
            class="absolute inset-0 flex flex-col bg-white dark:bg-neutral-600 dark:text-white"
        >
            <header
                class="w-full border-b border-gray-200 bg-blue-300 dark:border-neutral-500 dark:bg-neutral-700"
            >
                <div class="relative mx-auto w-[640px] p-4 text-center">
                    <div class="font-medium">
                        {{ form().value.id ? 'Edit' : 'New' }} Building Level
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
                        <label for="display-name">Display Name</label>
                        <mat-form-field appearance="outline" class="w-full">
                            <input
                                matInput
                                name="display-name"
                                formControlName="display_name"
                                placeholder="Level Display Name"
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
                                placeholder="Level Name"
                            />
                            <mat-hint>
                                Organisational name for the level
                            </mat-hint>
                            <mat-error>Name is required</mat-error>
                        </mat-form-field>
                    </div>
                    <div class="w-full">
                        <label for="building">Building</label>
                        <mat-form-field appearance="outline" class="w-full">
                            <mat-select
                                name="building"
                                formControlName="parent_id"
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
export class OrganisationLevelModalComponent {
    private readonly _data = signal(
        inject<{
            lvl?: BuildingLevel;
            bld_list: Building[];
        }>(MAT_DIALOG_DATA),
    );

    public readonly onSave = output<Partial<BuildingLevel>>();
    public readonly loading = signal(false);

    public readonly building_list = computed(() => this._data().bld_list);
    public readonly form = signal(
        new FormGroup({
            id: new FormControl(this._data().lvl?.id ?? ''),
            parent_id: new FormControl(
                this._data().lvl?.parent_id ?? this.building_list()[0].id,
                [Validators.required],
            ),
            display_name: new FormControl(this._data().lvl?.display_name ?? ''),
            name: new FormControl(this._data().lvl?.name ?? '', [
                Validators.required,
            ]),
            allow_visitors: new FormControl(
                this._data().lvl?.allow_visitors ?? false,
            ),
            catering_available: new FormControl(
                this._data().lvl?.catering_available ?? false,
            ),
        }),
    );

    public save() {
        this.form().markAllAsTouched();
        if (!this.form().valid) return;
        this.loading.set(true);
        this.onSave.emit(this.form().getRawValue());
    }
}
