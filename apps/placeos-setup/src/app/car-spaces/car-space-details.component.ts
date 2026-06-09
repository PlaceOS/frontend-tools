import { Component, computed, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatTooltip } from '@angular/material/tooltip';
import { IconComponent } from '../../../../../libs/components/src/lib/icon.component';
import { CarSpace, CarSpacesService } from './car-spaces.service';

@Component({
    selector: `car-space-details,[car-space-details]`,
    template: `
        <div
            details
            class="relative flex items-center border-b border-neutral-500 text-sm hover:bg-black/10"
        >
            <div thead class="w-10 min-w-0">
                <mat-checkbox
                    [ngModel]="selected()"
                    (ngModelChange)="setSelected($event)"
                />
            </div>
            <div thead class="font-mono text-xs">{{ item().map_id }}</div>
            <div thead>{{ item().name }}</div>
            <div thead>{{ item().building_id }}</div>
            <div thead>{{ item().level_id }}</div>
            <div thead>{{ item().type }}</div>
            <div thead class="w-64">
                {{ item().features?.join() || 'NONE' }}
            </div>
            <div thead class="w-64">
                {{ item().whitelist_groups?.join() || 'NONE' }}
            </div>
            <div thead>{{ item().plate_recognition ? 'YES' : 'NO' }}</div>
            <div thead>{{ item().bookable ? 'YES' : 'NO' }}</div>
            <div thead>{{ item().auto_release ? 'YES' : 'NO' }}</div>
            <div thead>{{ item().auto_release_delay || '10' }} minutes</div>
            <div thead class="w-32">{{ item().sensor_brand }}</div>
            <div thead>{{ item().recurrence ? 'YES' : 'NO' }}</div>
            <div thead>{{ item().max_recurrence }}</div>
            <div
                actions
                class="absolute top-1/2 left-12 flex w-auto min-w-0 -translate-y-1/2 items-center rounded-3xl bg-white !p-0 shadow dark:bg-neutral-700"
            >
                <button
                    mat-icon-button
                    matTooltip="Edit Car Space"
                    (click)="edit()"
                >
                    <app-icon>edit</app-icon>
                </button>
                <button
                    mat-icon-button
                    matTooltip="Delete Car Space"
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
            }

            [details] > div {
                min-width: 6rem;
                width: 6rem;
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
export class CarSpaceDetailsComponent {
    private _service = inject(CarSpacesService);

    public readonly item = input<CarSpace>(undefined);

    public readonly edit = () => this._service.openCarSpaceModal(this.item());
    public readonly remove = () => this._service.removeCarSpace(this.item());
    public readonly setSelected = (s) =>
        this._service.setSelected(this.item().id, s);

    public readonly selected = computed(() => {
        return this._service.isSelected(this.item().id);
    });
}
