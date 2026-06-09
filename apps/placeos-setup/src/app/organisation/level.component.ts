import { Component, computed, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatTooltip } from '@angular/material/tooltip';
import { IconComponent } from '../../../../../libs/components/src/lib/icon.component';
import { BuildingLevel, OrganisationService } from './organisation.service';

@Component({
    selector: `org-level,[org-level]`,
    template: `
        <div
            class="absolute top-0 bottom-px left-0 min-h-0 w-2 bg-neutral-800"
        ></div>
        <div
            details
            class="flex items-center border-b border-neutral-500 text-sm hover:bg-black/10"
        >
            <div thead class="relative min-w-0">
                <mat-checkbox
                    [ngModel]="selected()"
                    (ngModelChange)="setSelected($event)"
                />
            </div>
            <div class="w-10 min-w-0 p-0"></div>
            <div class="w-56">{{ level().display_name }}</div>
            <div></div>
            <div class="w-32"></div>
            <div class="w-56"></div>
            <div></div>
            <div></div>
            <div>{{ level().allow_visitors ? 'YES' : 'NO' }}</div>
            <div>{{ level().catering_available ? 'YES' : 'NO' }}</div>
            <div
                actions
                class="absolute top-1/2 left-24 flex min-w-0 -translate-y-1/2 items-center rounded-3xl bg-white !p-0 shadow dark:bg-neutral-700"
            >
                <button
                    mat-icon-button
                    matTooltip="Edit Level"
                    (click)="edit()"
                >
                    <app-icon>edit</app-icon>
                </button>
                <button
                    mat-icon-button
                    matTooltip="Delete Level"
                    (click)="remove()"
                >
                    <app-icon>delete</app-icon>
                </button>
            </div>
        </div>
    `,
    styles: [
        `
            :host {
                min-width: 100%;
                position: relative;
            }

            [details] > div {
                min-width: 6rem;
                padding: 1rem;
                flex-shrink: 0;
            }

            [actions] {
                opacity: 0;
                transition: opacity 200ms;
                pointer-events: none;
            }

            [details]:hover [actions] {
                opacity: 1;
                pointer-events: auto;
            }
        `,
    ],
    imports: [
        MatCheckbox,
        FormsModule,
        MatIconButton,
        MatTooltip,
        IconComponent,
    ],
})
export class OrganisationLevelComponent {
    private _org = inject(OrganisationService);

    public readonly level = input<BuildingLevel>(undefined);

    public readonly edit = () => this._org.openLevelModal(this.level());
    public readonly remove = () => this._org.removeLevel(this.level());
    public readonly setSelected = (s) =>
        this._org.setSelected(this.level().id, s);

    public readonly selected = computed(() => {
        return this._org.isSelected(this.level().id);
    });
}
