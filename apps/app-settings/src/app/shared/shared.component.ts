import { Component } from '@angular/core';
import { SettingsStateService } from '../settings-state.service';

@Component({
    selector: 'app-shared',
    template: `
        <form [formGroup]="form">
            <div
                class="flex flex-col w-full p-4 space-y-2"
                formGroupName="shared"
            >
                <div class="flex flex-col w-full">
                    <label>Application Name</label>
                    <mat-form-field
                        no-label
                        appearance="outline"
                        class="w-full"
                    >
                        <input matInput placeholder="Application Name" />
                    </mat-form-field>
                </div>
                <div class="flex flex-col w-full">
                    <label>Application Title</label>
                    <mat-form-field
                        no-label
                        appearance="outline"
                        class="w-full"
                    >
                        <input matInput placeholder="Application Title" />
                    </mat-form-field>
                </div>
                <div class="flex flex-col w-full">
                    <label>Short Name</label>
                    <mat-form-field
                        no-label
                        appearance="outline"
                        class="w-full"
                    >
                        <input matInput placeholder="Short Name" />
                    </mat-form-field>
                </div>
                <div class="flex flex-col w-full">
                    <label>Logo(Light Backgrounds)</label>
                    <mat-form-field
                        no-label
                        appearance="outline"
                        class="w-full"
                    >
                        <input
                            matInput
                            placeholder="Logo for light backgrounds"
                        />
                    </mat-form-field>
                </div>
                <div class="flex flex-col w-full">
                    <label>Logo(Dark Backgrounds)</label>
                    <mat-form-field
                        no-label
                        appearance="outline"
                        class="w-full"
                    >
                        <input
                            matInput
                            placeholder="Logo for Dark backgrounds"
                        />
                    </mat-form-field>
                </div>
                <h3 class="text-lg font-medium">Theme</h3>
                <color-list-field formControlName="css_variables"></color-list-field>
            </div>
        </form>
    `,
    styles: [
        `
            label {
                margin-bottom: 0.25rem;
            }
        `,
    ],
})
export class AppSharedComponent {
    public readonly form = this._state.form;
    constructor(private _state: SettingsStateService) {}
}
