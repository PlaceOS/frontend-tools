import { Component } from '@angular/core';
import { SettingsStateService } from '../settings-state.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { ColorListFieldComponent } from '../components/color-list-field.component';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-workplace',
    template: `
        <form [formGroup]="form" class="w-full">
            <div
                class="flex flex-col w-full p-4 space-y-2"
                formGroupName="workplace"
            >
                <div class="flex space-x-2" formGroupName="banner">
                    <div class="flex flex-col w-full">
                        <label>Banner Type</label>
                        <mat-form-field
                            no-label
                            appearance="outline"
                            class="w-full"
                        >
                            <mat-select formControlName="type">
                                <mat-option value="info">
                                    Informational (Blue)
                                </mat-option>
                                <mat-option value="warn">
                                    Warning (Yellow)
                                </mat-option>
                                <mat-option value="error">
                                    Urgent (Red)
                                </mat-option>
                            </mat-select>
                        </mat-form-field>
                    </div>
                    <div class="flex flex-col w-full">
                        <label>Banner Contents</label>
                        <mat-form-field
                            no-label
                            appearance="outline"
                            class="w-full"
                        >
                            <textarea
                                matInput
                                formControlName="content"
                                placeholder="Banner contents"
                            ></textarea>
                        </mat-form-field>
                    </div>
                </div>
                <h3 class="text-lg font-medium">Features</h3>
                <div class="flex flex-wrap pb-4">
                    @for (f of feature_list; track f) {
                    <div class="flex flex-col min-w-[40%] flex-1">
                        <mat-checkbox
                            [ngModel]="features.includes(f[0])"
                            [ngModelOptions]="{ standalone: true }"
                            (ngModelChange)="toggleFeature(f[0])"
                        >
                            {{ f[1] }}
                        </mat-checkbox>
                    </div>
                    }
                </div>
                <h3 class="text-lg font-medium">Dashboard</h3>
                <div class="flex flex-wrap pb-4">
                    <div class="flex flex-col min-w-[40%] flex-1">
                        <mat-checkbox formControlName="hide_contacts">
                            Hide Dashboard Contacts
                        </mat-checkbox>
                    </div>
                    <div class="flex flex-col min-w-[40%] flex-1">
                        <mat-checkbox formControlName="hide_availability">
                            Hide Dashboard Availability
                        </mat-checkbox>
                    </div>
                    <div class="flex flex-col min-w-[40%] flex-1">
                        <mat-checkbox formControlName="can_deliver">
                            Enable Dashboard Delivery
                        </mat-checkbox>
                    </div>
                </div>
                <h3 class="text-lg font-medium">Event Booking</h3>
                <div class="flex flex-wrap pb-4">
                    <div
                        class="flex flex-col min-w-[40%] flex-1"
                        formGroupName="directory"
                    >
                        <mat-checkbox formControlName="show_avatars">
                            Show User Avatars
                        </mat-checkbox>
                    </div>
                    <ng-container formGroupName="events">
                        <div class="flex flex-col w-full min-w-[40%] flex-1">
                            <mat-checkbox formGroupName="has_catering">
                                Enable Catering for Events
                            </mat-checkbox>
                        </div>
                        <div class="flex flex-col w-full min-w-[40%] flex-1">
                            <mat-checkbox formGroupName="can_book_for_others">
                                Enable booking for other users
                            </mat-checkbox>
                        </div>
                        <div class="flex flex-col w-full min-w-[40%] flex-1">
                            <mat-checkbox formGroupName="hide_user_actions">
                                Prevent External Attendees for Events
                            </mat-checkbox>
                        </div>
                        <div class="flex flex-col w-full min-w-[40%] flex-1">
                            <mat-checkbox formControlName="multiple_spaces">
                                Allow booking of multiple Spaces
                            </mat-checkbox>
                        </div>
                        <div class="flex flex-col w-full min-w-[40%] flex-1">
                            <mat-checkbox formControlName="allow_all_day">
                                Allow all day bookings
                            </mat-checkbox>
                        </div>
                        <div class="flex flex-col w-full min-w-[40%] flex-1">
                            <label for="max-duration">
                                Max Booking Duration
                            </label>
                            <mat-form-field no-label appearance="outline">
                                <input
                                    matInput
                                    name="max-duration"
                                    formControlName="max_duration"
                                    type="number"
                                />
                            </mat-form-field>
                        </div>
                    </ng-container>
                </div>
                <h3 class="text-lg font-medium">Desk Booking</h3>
                <div class="flex flex-wrap pb-4" formGroupName="desks">
                    <div class="flex flex-col min-w-[40%] flex-1">
                        <mat-checkbox formGroupName="recurrence_allowed">
                            Enable Recurrence for Desk bookings
                        </mat-checkbox>
                    </div>
                    <div class="flex flex-col w-full min-w-[40%] flex-1">
                        <mat-checkbox formGroupName="can_book_for_others">
                            Enable booking for other users
                        </mat-checkbox>
                    </div>
                    <div class="flex flex-col min-w-[40%] flex-1">
                        <mat-checkbox formGroupName="allow_group">
                            Enable group bookings for Desks
                        </mat-checkbox>
                    </div>
                    <div class="flex flex-col min-w-[40%] flex-1">
                        <mat-checkbox formGroupName="needs_reason">
                            Whether desk bookings require a reason
                        </mat-checkbox>
                    </div>
                    <div class="flex flex-col min-w-[40%] flex-1">
                        <mat-checkbox formGroupName="auto_allocation">
                            Enable auto-allocating desks by department
                        </mat-checkbox>
                    </div>
                    <div class="flex flex-col min-w-[40%] flex-1">
                        <mat-checkbox formGroupName="allow_time_changes">
                            Enable selecting time for bookings
                        </mat-checkbox>
                    </div>
                    <div class="flex flex-col min-w-[40%] flex-1">
                        <mat-checkbox formGroupName="allow_all_day">
                            Enable setting bookings as all day when time
                            selection available
                        </mat-checkbox>
                    </div>
                </div>
                <h3 class="text-lg font-medium">Map Explore</h3>
                <div class="flex flex-wrap pb-4" formGroupName="explore">
                    <div class="flex flex-col min-w-[40%]">
                        <mat-checkbox formControlName="can_select_building">
                            Enable Building selection on maps
                        </mat-checkbox>
                    </div>
                </div>
                <h3 class="text-lg font-medium">Theme</h3>
                <color-list-field
                    formControlName="css_variables"
                ></color-list-field>
            </div>
        </form>
        <button mat-button class="w-32 my-2 mx-auto" (click)="save()">
            Save Changes
        </button>
    `,
    styles: [
        `
            :host {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
        `,
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormField,
        MatSelect,
        MatOption,
        MatInput,
        MatCheckbox,
        ColorListFieldComponent,
        MatButton,
    ],
})
export class AppWorkplaceComponent {
    public readonly form = this._state.form;
    public readonly save = () => this._state.saveSettings('workplace_app');

    public feature_list = [
        ['spaces', 'Book Rooms'],
        ['desks', 'Book Desks'],
        ['parking', 'Book Car Spaces'],
        ['schedule', 'Your Bookings'],
        ['explore', 'Explore Maps'],
    ];

    public get features() {
        const form = this.form.get('workplace');
        if (!form) return [];
        return form.value.features || [];
    }

    public toggleFeature(feature: string) {
        const form = this.form.get('workplace');
        if (!form) return;
        const feature_list: string[] = form.value.features || [];
        if (feature_list.includes(feature)) {
            form.patchValue({
                features: feature_list.filter((_) => _ !== feature),
            });
        } else {
            form.patchValue({ features: [...feature_list, feature] });
        }
    }

    constructor(private _state: SettingsStateService) {}
}
