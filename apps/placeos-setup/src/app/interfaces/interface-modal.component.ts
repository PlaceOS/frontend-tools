import { Component, inject, output, signal } from '@angular/core';
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
import { Interface } from './interfaces.service';
import { ANIMATION_SHOW_CONTRACT_EXPAND } from '@placeos-tools/common';
import { MatIconButton, MatButton } from '@angular/material/button';
import { IconComponent } from '../../../../../libs/components/src/lib/icon.component';
import { MatFormField, MatHint, MatError } from '@angular/material/form-field';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatCheckbox } from '@angular/material/checkbox';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'interface-modal',
    template: `
        <div
            class="absolute inset-0 bg-white dark:bg-neutral-600 dark:text-white flex flex-col"
        >
            <header
                class="w-full bg-blue-300 dark:bg-neutral-700 border-b border-gray-200 dark:border-neutral-500 flex flex-col space-y-2"
            >
                <div class="mx-auto w-[640px] relative p-4 text-center">
                    <div class="font-medium">
                        {{ form.value.id ? 'Edit' : 'New' }}
                        {{
                            form.value.building_id === 'default'
                                ? 'Default'
                                : ''
                        }}
                        Interface
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
                class="mx-auto w-[640px] p-4 flex-1 h-1/2 overflow-auto flex flex-col space-y-2"
                [formGroup]="form"
            >
                @if (form.value.building_id !== 'default') {
                <div class="w-full">
                    <label for="building">Building</label>
                    <mat-form-field appearance="outline" class="w-full">
                        <mat-select
                            name="building"
                            formControlName="building_id"
                            placeholder="Building"
                        >
                            @for (item of building_list | async; track item) {
                            <mat-option
                                [value]="item.id"
                                (click)="
                                    form.patchValue({
                                        building_name:
                                            item.display_name || item.name
                                    })
                                "
                            >
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
                }
                <div class="" formGroupName="workplace">
                    <mat-checkbox
                        class="mb-2"
                        [disabled]="true"
                        formControlName="required"
                    >
                        Is Workplace App required?
                    </mat-checkbox>
                    <div
                        class="rounded border border-gray-200 dark:border-neutral-500"
                        [@show]="
                            form.value.workplace.required ? 'show' : 'hide'
                        "
                    >
                        <div class="p-4 flex flex-col space-y-2">
                            <mat-checkbox formControlName="meetings">
                                Can the user book meetings?
                            </mat-checkbox>
                            <mat-checkbox formControlName="catering">
                                Can the user add catering to meetings?
                            </mat-checkbox>
                            <mat-checkbox formControlName="desks">
                                Can the user book desks?
                            </mat-checkbox>
                            <mat-checkbox formControlName="group_desks">
                                Can the user book a group of desks?
                            </mat-checkbox>
                            <mat-checkbox formControlName="parking"
                                >Can the user book a car space?</mat-checkbox
                            >
                            <mat-checkbox formControlName="lockers">
                                Can the user book a locker?
                            </mat-checkbox>
                            <mat-checkbox formControlName="assets">
                                Can the user book assets?
                            </mat-checkbox>
                            <mat-checkbox formControlName="visitors">
                                Can the user add external attendees to meetings?
                            </mat-checkbox>
                            <mat-checkbox formControlName="standalone_visitors">
                                Can the user invite visitors without a meeting?
                            </mat-checkbox>
                        </div>
                    </div>
                </div>
                <div class="" formGroupName="concierge">
                    <mat-checkbox class="mb-2" formControlName="required">
                        Is Concierge App required?
                    </mat-checkbox>
                    <div
                        class="rounded border border-gray-200 dark:border-neutral-500"
                        [@show]="
                            form.value.concierge.required ? 'show' : 'hide'
                        "
                    >
                        <div class="p-4 flex flex-col space-y-2">
                            <mat-checkbox formControlName="match_workplace">
                                Should concierge features match workplace?
                            </mat-checkbox>
                        </div>
                    </div>
                </div>
                <div class="" formGroupName="booking_panel">
                    <mat-checkbox class="mb-2" formControlName="required">
                        Is Booking Panel required?
                    </mat-checkbox>
                    <div
                        class="rounded border border-gray-200 dark:border-neutral-500"
                        [@show]="
                            form.value.booking_panel.required ? 'show' : 'hide'
                        "
                    >
                        <div class="p-4 flex flex-col space-y-2">
                            <mat-checkbox formControlName="show_title">
                                Should meeting titles?
                            </mat-checkbox>
                            <mat-checkbox formControlName="show_host">
                                Should meeting host?
                            </mat-checkbox>
                            <mat-checkbox formControlName="show_images">
                                Should room image?
                            </mat-checkbox>
                            <mat-checkbox formControlName="show_qrcode">
                                Should meeting checkin QR code?
                            </mat-checkbox>
                        </div>
                    </div>
                </div>
                <div class="" formGroupName="visitor_kiosk">
                    <mat-checkbox class="mb-2" formControlName="required">
                        Is Visitor Kiosk required?
                    </mat-checkbox>
                    <div
                        class="rounded border border-gray-200 dark:border-neutral-500"
                        [@show]="
                            form.value.visitor_kiosk.required ? 'show' : 'hide'
                        "
                    >
                        <div class="p-4 flex flex-col space-y-2">
                            <mat-checkbox formControlName="induction">
                                Should walk visitor through an induction?
                            </mat-checkbox>
                            <mat-checkbox formControlName="catering">
                                Should allow visitor to pre-order catering?
                            </mat-checkbox>
                        </div>
                    </div>
                </div>
                <div class="" formGroupName="map_kiosk">
                    <mat-checkbox class="mb-2" formControlName="required">
                        Is Map Kiosk required?
                    </mat-checkbox>
                    <div
                        class="rounded border border-gray-200 dark:border-neutral-500"
                        [@show]="
                            form.value.map_kiosk.required ? 'show' : 'hide'
                        "
                    >
                        <div class="p-4 flex flex-col space-y-2">
                            <mat-checkbox formControlName="touch_enabled">
                                Should UI be interactive?
                            </mat-checkbox>
                        </div>
                    </div>
                </div>
                <div class="" formGroupName="outlook_plugin">
                    <mat-checkbox class="mb-2" formControlName="required">
                        Is Outlook plugin required?
                    </mat-checkbox>
                </div>
            </main>
            <footer
                class="w-full bg-blue-300 dark:bg-neutral-700 border-t border-gray-200 dark:border-neutral-500 flex flex-col space-y-2"
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
                <p>Saving interface data...</p>
            </div>
            }
        </div>
    `,
    styles: [``],
    animations: [ANIMATION_SHOW_CONTRACT_EXPAND],
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
        MatCheckbox,
        MatButton,
        AsyncPipe,
    ],
})
export class InterfaceModalComponent {
    private _data = inject<Interface>(MAT_DIALOG_DATA);
    private _org = inject(OrganisationService);

    public readonly onSave = output<Partial<Interface>>();
    public readonly loading = signal(false);
    public addOnBlur = true;

    public readonly separatorKeysCodes = [ENTER, COMMA] as const;
    public readonly building_list = this._org.buildings;
    public readonly level_list = this._org.levels;
    public readonly form = new FormGroup({
        id: new FormControl(''),
        building_id: new FormControl('', [Validators.required]),
        building_name: new FormControl(''),
        required: new FormControl([]),
        workplace: new FormGroup({
            required: new FormControl(true),
            meetings: new FormControl(true),
            catering: new FormControl(false),
            assets: new FormControl(false),
            desks: new FormControl(true),
            group_desks: new FormControl(false),
            parking: new FormControl(false),
            lockers: new FormControl(false),
            visitors: new FormControl(true),
            standalone_visitors: new FormControl(true),
        }),
        concierge: new FormGroup({
            required: new FormControl(true),
            match_workplace: new FormControl(true),
        }),
        booking_panel: new FormGroup({
            required: new FormControl(true),
            show_title: new FormControl(true),
            show_host: new FormControl(true),
            show_images: new FormControl(true),
            show_qrcode: new FormControl(true),
        }),
        visitor_kiosk: new FormGroup({
            required: new FormControl(false),
            induction: new FormControl(true),
            catering: new FormControl(false),
        }),
        map_kiosk: new FormGroup({
            required: new FormControl(false),
            touch_enabled: new FormControl(true),
        }),
        outlook_plugin: new FormGroup({
            required: new FormControl(false),
        }),
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
