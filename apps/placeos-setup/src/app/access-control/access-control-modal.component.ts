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
import { AccessControl } from './access-control.service';

@Component({
    selector: 'access-control-modal',
    template: `
        <div
            class="absolute inset-0 flex flex-col bg-white dark:bg-neutral-600 dark:text-white"
        >
            <header
                class="w-full border-b border-gray-200 bg-blue-300 dark:border-neutral-500 dark:bg-neutral-700"
            >
                <div class="relative mx-auto w-[640px] p-4 text-center">
                    <div class="font-medium">
                        {{ form.value.id ? 'Edit' : 'New' }} Access Control
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
                            <mat-error
                                >Service Integration is required</mat-error
                            >
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
                        <mat-checkbox
                            name="isolated"
                            formControlName="isolated"
                        >
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
    ],
})
export class AccessControlModalComponent {
    private _data = inject<AccessControl>(MAT_DIALOG_DATA);
    private _org = inject(OrganisationService);

    public readonly onSave = output<Partial<AccessControl>>();
    public readonly loading = signal(false);
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
