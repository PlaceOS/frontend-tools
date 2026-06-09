import { Component, computed, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatTooltip } from '@angular/material/tooltip';
import { IconComponent } from '../../../../../libs/components/src/lib/icon.component';
import { BuildingMonitoring, MonitoringService } from './monitoring.service';

@Component({
    selector: `monitoring-item-details,[monitoring-item-details]`,
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
            <div thead class="w-48">{{ item().id }}</div>
            <div thead class="w-48">{{ item().level_id }}</div>
            <div thead>{{ item().required ? 'YES' : 'NO' }}</div>
            <div thead class="w-32">{{ item().sensor_brand }}</div>
            <div thead>
                {{ item().sensor_locations_available ? 'YES' : 'NO' }}
            </div>
            <div thead>{{ item().show_on_map ? 'YES' : 'NO' }}</div>
            <div thead>{{ item().show_in_analytics ? 'YES' : 'NO' }}</div>
            <div
                actions
                class="absolute top-1/2 left-12 flex w-auto min-w-0 -translate-y-1/2 items-center rounded-3xl bg-white !p-0 shadow dark:bg-neutral-700"
            >
                <button
                    mat-icon-button
                    matTooltip="Edit Region"
                    (click)="edit()"
                >
                    <app-icon>edit</app-icon>
                </button>
                <button
                    mat-icon-button
                    matTooltip="Delete Region"
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
                min-width: 8rem;
                width: 8rem;
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
export class MonitoringItemDetailsComponent {
    private _service = inject(MonitoringService);

    public readonly item = input<BuildingMonitoring>(undefined);

    public readonly edit = () => this._service.openItemModal(this.item());
    public readonly remove = () => this._service.removeItem(this.item());
    public readonly setSelected = (s) =>
        this._service.setSelected(this.item().id, s);

    public readonly selected = computed(() => {
        return this._service.isSelected(this.item().id);
    });
}
