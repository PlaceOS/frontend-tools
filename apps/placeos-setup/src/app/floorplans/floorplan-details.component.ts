import { Component, Input } from '@angular/core';
import { Building, OrganisationService } from '../organisation/organisation.service';
import { FloorPlan, FloorPlansService } from './floorplans.service';

@Component({
    selector: `floorplan-details,[floorplan-details]`,
    template: `
        <div
            details
            class="flex items-center border-b border-neutral-500 text-sm hover:bg-black/10 relative"
        >
            <div thead class="min-w-0 w-10">
                <mat-checkbox></mat-checkbox>
            </div>
            <div thead>{{ item.building_id }}</div>
            <div thead>{{ item.level_id }}</div>
            <div thead>{{ item.map_available ? 'YES' : 'NO' }}</div>
            <div thead>{{ item.features_setup ? 'YES' : 'NO' }}</div>
            <div thead>{{ item.zones_setup ? 'YES' : 'NO' }}</div>
            <div thead>{{ item.sensors_setup ? 'YES' : 'NO' }}</div>
            <div
                actions
                class="absolute top-1/2 -translate-y-1/2 left-12 rounded-3xl flex items-center bg-white dark:bg-neutral-700 shadow !p-0 min-w-0 w-auto"
            >
                <button mat-icon-button matTooltip="Edit Floor Plan" (click)="edit()">
                    <app-icon>edit</app-icon>
                </button>
                <button mat-icon-button matTooltip="Delete Floor Plan" (click)="remove()">
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
                min-width: 10rem;
                width: 10rem;
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
    ]
})
export class FloorPlanDetailsComponent {
    @Input() public item: FloorPlan;

    public readonly edit = () => this._service.openFloorPlanModal(this.item);
    public readonly remove = () => this._service.removeFloorPlan(this.item);

    constructor(private _service: FloorPlansService) {}
}
