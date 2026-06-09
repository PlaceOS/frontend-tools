import { Component, Inject, Output, EventEmitter } from '@angular/core';
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
import { Zone } from './zoning.service';
import { MatIconButton, MatButton } from '@angular/material/button';
import { IconComponent } from '../../../../../libs/components/src/lib/icon.component';
import { MatFormField, MatHint, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatCheckbox } from '@angular/material/checkbox';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'zone-modal',
    template: `
        <div
            class="absolute inset-0 bg-white dark:bg-neutral-600 dark:text-white flex flex-col"
        >
            <header
                class="w-full bg-blue-300 dark:bg-neutral-700 border-b border-gray-200 dark:border-neutral-500"
            >
                <div class="mx-auto w-[640px] relative p-4 text-center">
                    <div class="font-medium">
                        {{ form.value.id ? 'Edit' : 'New' }} Zone
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
                        <mat-hint> Organisational name for the zone </mat-hint>
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
                    <label for="counting-method">People Counting Method</label>
                    <mat-form-field appearance="outline" class="w-full">
                        <input
                            matInput
                            name="counting-method"
                            formControlName="counting_method"
                            placeholder="People counting method"
                        />
                        <mat-hint>
                            Method that PlaceOS should use for performing people
                            counting operations
                        </mat-hint>
                        <mat-error
                            >People counting method is required</mat-error
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
                    <label for="finding-method">People Finding Method</label>
                    <mat-form-field appearance="outline" class="w-full">
                        <input
                            matInput
                            name="finding-method"
                            formControlName="finding_method"
                            placeholder="People finding method"
                        />
                        <mat-hint>
                            Method that PlaceOS should use for performing people
                            finding operations
                        </mat-hint>
                        <mat-error>People finding method is required</mat-error>
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
        AsyncPipe,
    ],
})
export class ZoneModalComponent {
    @Output() public readonly onSave = new EventEmitter<Partial<Zone>>();
    public loading = false;
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

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private _data: Zone,
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
