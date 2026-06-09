import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ColorListFieldComponent } from '../components/color-list-field.component';
import { SettingsStateService } from '../settings-state.service';

@Component({
    selector: 'app-shared',
    template: `
        <form [formGroup]="form()" class="w-full">
            <div
                class="flex w-full flex-col space-y-2 p-4"
                formGroupName="shared"
            >
                <div class="flex w-full flex-col">
                    <label>Application Name</label>
                    <mat-form-field
                        no-label
                        appearance="outline"
                        class="w-full"
                    >
                        <input matInput placeholder="Application Name" />
                    </mat-form-field>
                </div>
                <div class="flex w-full flex-col">
                    <label>Application Title</label>
                    <mat-form-field
                        no-label
                        appearance="outline"
                        class="w-full"
                    >
                        <input matInput placeholder="Application Title" />
                    </mat-form-field>
                </div>
                <div class="flex w-full flex-col">
                    <label>Short Name</label>
                    <mat-form-field
                        no-label
                        appearance="outline"
                        class="w-full"
                    >
                        <input matInput placeholder="Short Name" />
                    </mat-form-field>
                </div>
                <div class="flex w-full flex-col">
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
                <div class="flex w-full flex-col">
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
                <color-list-field formControlName="css_variables" />
            </div>
        </form>
        <button mat-button class="mx-auto my-2 w-32" (click)="save()">
            Save Changes
        </button>
    `,
    styles: [
        `
            label {
                margin-bottom: 0.25rem;
            }
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
        MatInput,
        ColorListFieldComponent,
        MatButton,
    ],
})
export class AppSharedComponent {
    private _state = inject(SettingsStateService);

    public readonly form = this._state.form;
    public readonly save = () => this._state.saveSettings('settings');
}
