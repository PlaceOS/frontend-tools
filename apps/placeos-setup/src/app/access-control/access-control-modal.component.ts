import { Component, Inject, Output, EventEmitter } from '@angular/core';
import {
    FormControl,
    FormGroup,
    Validators,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';

import { OrganisationService } from '../organisation/organisation.service';
import { AccessControl } from './access-control.service';
import { MatIconButton, MatButton } from '@angular/material/button';
import { IconComponent } from '../../../../../libs/components/src/lib/icon.component';
import { MatFormField, MatHint, MatError } from '@angular/material/form-field';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'access-control-modal',
    template: `
        <div
            class="absolute inset-0 bg-white dark:bg-neutral-600 dark:text-white flex flex-col"
        >
            <header
                class="w-full bg-blue-300 dark:bg-neutral-700 border-b border-gray-200 dark:border-neutral-500"
            >
                <div class="mx-auto w-[640px] relative p-4 text-center">
                    <div class="font-medium">
                        {{ form.value.id ? 'Edit' : 'New' }} Access Control
                    </div>
                    @if (!loading) {
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
            @if (!loading) {
            <main
                class="mx-auto w-[640px] p-4 flex-1 h-1/2 overflow-auto"
                [formGroup]="form"
            >
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
                    <label for="type">Service Integration</label>
                    <mat-form-field appearance="outline" class="w-full">
                        <input
                            matInput
                            name="type"
                            formControlName="type"
                            placeholder="Lenel/Gallagher"
                        />
                        <mat-hint>
                            Name of the service integration for security
                        </mat-hint>
                        <mat-error>Service Integration is required</mat-error>
                    </mat-form-field>
                </div>
                <div class="w-full py-2">
                    <mat-checkbox
                        name="managed-onsite"
                        formControlName="managed_onsite"
                    >
                        Is this integration managed onsite?
                    </mat-checkbox>
                </div>
                <div class="w-full py-2">
                    <mat-checkbox name="isolated" formControlName="isolated">
                        Is the integration isolated from the internet?
                    </mat-checkbox>
                </div>
                <div class="w-full py-2">
                    <mat-checkbox
                        name="staff-linked"
                        formControlName="linked_to_staff_db"
                    >
                        Is access control linked to staff members?
                    </mat-checkbox>
                </div>
                <div class="w-full py-2">
                    <mat-checkbox
                        name="tied-identity"
                        formControlName="access_tied_to_identity"
                    >
                        Are access passes linked to staff members
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
                <mat-spinner></mat-spinner>
                <p>Saving access control data...</p>
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
export class AccessControlModalComponent {
    @Output() public readonly onSave = new EventEmitter<
        Partial<AccessControl>
    >();
    public loading = false;
    public addOnBlur = true;

    public readonly separatorKeysCodes = [ENTER, COMMA] as const;
    public readonly building_list = this._org.buildings;
    public readonly level_list = this._org.levels;
    public readonly form = new FormGroup({
        id: new FormControl(''),
        building_id: new FormControl('', [Validators.required]),
        type: new FormControl(''),
        managed_onsite: new FormControl(false),
        isolated: new FormControl(false),
        linked_to_staff_db: new FormControl(false),
        access_tied_to_identity: new FormControl(false),
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
        private _data: AccessControl,
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
