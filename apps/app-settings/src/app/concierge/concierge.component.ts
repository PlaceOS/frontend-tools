import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { ColorListFieldComponent } from '../components/color-list-field.component';
import { SettingsStateService } from '../settings-state.service';

@Component({
    selector: 'app-concierge',
    template: `
        <form [formGroup]="form()" class="w-full">
            <div
                class="flex w-full flex-col space-y-2 p-4"
                formGroupName="concierge"
            >
                <div class="flex space-x-2" formGroupName="banner">
                    <div class="flex w-full flex-col">
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
                    <div class="flex w-full flex-col">
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
                    @for (f of feature_list(); track f) {
                        <div class="flex min-w-[40%] flex-1 flex-col">
                            <mat-checkbox
                                [ngModel]="features().includes(f[0])"
                                [ngModelOptions]="{ standalone: true }"
                                (ngModelChange)="toggleFeature(f[0])"
                            >
                                {{ f[1] }}
                            </mat-checkbox>
                        </div>
                    }
                </div>
                <color-list-field formControlName="css_variables" />
            </div>
        </form>
        <button mat-button class="mx-auto my-2 w-32" (click)="save()">
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
export class AppConciergeComponent {
    private _state = inject(SettingsStateService);

    public readonly form = this._state.form;
    public readonly save = () => this._state.saveSettings('concierge_app');

    public feature_list = signal([
        ['daily-calendar', 'Daily Calendar'],
        ['facilities', 'Facilities'],
        ['catering', 'Catering'],
        ['visitors', 'Visitors'],
        ['desks', 'Desks'],
        ['staff', 'Staff Directory'],
        ['points', 'Points'],
        ['reports', 'Reports'],
        ['asset-manager', 'Asset Manager'],
    ]);

    public readonly features = computed(() => {
        const form = this.form().get('concierge');
        if (!form) return [];
        return form.value.features || [];
    });

    public toggleFeature(feature: string) {
        const form = this.form().get('concierge');
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
}
