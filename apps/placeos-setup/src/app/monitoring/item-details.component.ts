import { Component, Input } from '@angular/core';
import {
    Building,
    OrganisationService,
} from '../organisation/organisation.service';
import { BuildingMonitoring, MonitoringService } from './monitoring.service';

@Component({
    standalone: false,
    selector: `monitoring-item-details,[monitoring-item-details]`,
    template: `
        <div
            details
            class="flex items-center border-b border-neutral-500 text-sm hover:bg-black/10 relative"
        >
            <div thead class="min-w-0 w-10">
                <mat-checkbox [ngModel]="selected" (ngModelChange)="setSelected($event)"></mat-checkbox>
            </div>
            <div thead class="w-48">{{ item.id }}</div>
            <div thead class="w-48">{{ item.level_id }}</div>
            <div thead>{{ item.required ? 'YES' : 'NO' }}</div>
            <div thead class="w-32">{{ item.sensor_brand }}</div>
            <div thead>
                {{ item.sensor_locations_available ? 'YES' : 'NO' }}
            </div>
            <div thead>{{ item.show_on_map ? 'YES' : 'NO' }}</div>
            <div thead>{{ item.show_in_analytics ? 'YES' : 'NO' }}</div>
            <div
                actions
                class="absolute top-1/2 -translate-y-1/2 left-12 rounded-3xl flex items-center bg-white dark:bg-neutral-700 shadow !p-0 min-w-0 w-auto"
            >
                <button mat-icon-button matTooltip="Edit Region" (click)="edit()">
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

})
export class MonitoringItemDetailsComponent {
    @Input() public item: BuildingMonitoring;

    public readonly edit = () => this._service.openItemModal(this.item);
    public readonly remove = () => this._service.removeItem(this.item);
    public readonly setSelected = (s) => this._service.setSelected(this.item.id, s);

    public get selected() {
        return this._service.isSelected(this.item.id);
    }

    constructor(private _service: MonitoringService) {}
}
