import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, inject, output, signal } from '@angular/core';
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import {
    MatChip,
    MatChipInput,
    MatChipInputEvent,
    MatChipRemove,
} from '@angular/material/chips';

import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';

import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatError, MatFormField, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { IconComponent } from '../../../../../libs/components/src/lib/icon.component';
import { OrganisationService } from '../organisation/organisation.service';
import { Zone } from './zoning.service';

@Component({
    selector: 'zone-modal',
    template: `
        <div
            class="absolute inset-0 flex flex-col bg-white dark:bg-neutral-600 dark:text-white"
        >
            <header
                class="w-full border-b border-gray-200 bg-blue-300 dark:border-neutral-500 dark:bg-neutral-700"
            >
                <div class="relative mx-auto w-[640px] p-4 text-center">
                    <div class="font-medium">
                        {{ form.value.id ? 'Edit' : 'New' }} Zone
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
                                Organisational name for the zone
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
                                Building Level that the zone resides in
                            </mat-hint>
                            <mat-error>Building Level is required</mat-error>
                        </mat-form-field>
                    </div>
                    <div class="w-full">
                        <label for="whi">Whitelist User Groups</label>
                        <mat-form-field appearance="outline" class="w-full">
                            <mat-chip-list
                                #groupList
                                aria-label="Whitelist User Groups"
                            >
                                @for (
                                    item of form.value.whitelist_groups;
                                    track item
                                ) {
                                    <mat-chip
                                        (removed)="
                                            remove(
                                                item,
                                                form.get('whitelist_groups')
                                            )
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
                                        add(
                                            $event,
                                            form.get('whitelist_groups')
                                        )
                                    "
                                />
                            </mat-chip-list>
                            <mat-hint>
                                Users groups to limit access to this zone
                            </mat-hint>
                            <mat-error>Display name is required</mat-error>
                        </mat-form-field>
                    </div>
                    <div class="w-full py-2">
                        <mat-checkbox
                            name="people-counting"
                            formControlName="people_counting"
                        >
                            Should people counting be enabled?
                        </mat-checkbox>
                    </div>
                    @if (form.value.people_counting) {
                        <div class="w-full">
                            <label for="counting-method"
                                >People Counting Method</label
                            >
                            <mat-form-field appearance="outline" class="w-full">
                                <input
                                    matInput
                                    name="counting-method"
                                    formControlName="counting_method"
                                    placeholder="People counting method"
                                />
                                <mat-hint>
                                    Method that PlaceOS should use for
                                    performing people counting operations
                                </mat-hint>
                                <mat-error
                                    >People counting method is
                                    required</mat-error
                                >
                            </mat-form-field>
                        </div>
                    }
                    <div class="w-full py-2">
                        <mat-checkbox
                            name="people-finding"
                            formControlName="people_finding"
                        >
                            Should people finding be enabled?
                        </mat-checkbox>
                    </div>
                    @if (form.value.people_finding) {
                        <div class="w-full">
                            <label for="finding-method"
                                >People Finding Method</label
                            >
                            <mat-form-field appearance="outline" class="w-full">
                                <input
                                    matInput
                                    name="finding-method"
                                    formControlName="finding_method"
                                    placeholder="People finding method"
                                />
                                <mat-hint>
                                    Method that PlaceOS should use for
                                    performing people finding operations
                                </mat-hint>
                                <mat-error
                                    >People finding method is
                                    required</mat-error
                                >
                            </mat-form-field>
                        </div>
                    }
                    <div class="w-full py-2">
                        <mat-checkbox
                            name="locatable-firewarden"
                            formControlName="locatable_firewarden"
                        >
                            Should firewardens be locatable?
                        </mat-checkbox>
                    </div>
                    <div class="w-full py-2">
                        <mat-checkbox
                            name="auto-release"
                            formControlName="locatable_firstaiders"
                        >
                            Should First Aiders be locatable?
                        </mat-checkbox>
                    </div>
                    <div class="w-full py-2">
                        <mat-checkbox
                            name="locatable-marshall"
                            formControlName="locatable_marshall"
                        >
                            Should COVID marshalls be locatable?
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
                    <p>Saving zone data...</p>
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
    ],
})
export class ZoneModalComponent {
    private _data = inject<Zone>(MAT_DIALOG_DATA);
    private _org = inject(OrganisationService);

    public readonly onSave = output<Partial<Zone>>();
    public readonly loading = signal(false);
    public addOnBlur = true;

    public readonly separatorKeysCodes = [ENTER, COMMA] as const;
    public readonly building_list = this._org.buildings;
    public readonly level_list = this._org.levels;
    public readonly form = new FormGroup({
        id: new FormControl(''),
        building_id: new FormControl('', [Validators.required]),
        level_id: new FormControl('', [Validators.required]),
        name: new FormControl('', [Validators.required]),
        capacity: new FormControl(2),
        whitelist_groups: new FormControl([]),
        people_counting: new FormControl(false),
        counting_method: new FormControl(''),
        people_finding: new FormControl(false),
        finding_method: new FormControl(''),
        locatable_firewarden: new FormControl(false),
        locatable_firstaiders: new FormControl(false),
        locatable_marshall: new FormControl(false),
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
