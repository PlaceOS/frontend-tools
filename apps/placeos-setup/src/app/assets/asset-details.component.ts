import { Component, Input } from '@angular/core';
import {
    Building,
    OrganisationService,
} from '../organisation/organisation.service';
import { Asset, AssetsService } from './assets.service';

@Component({
    selector: `asset-details,[asset-details]`,
    template: `
        <div
            details
            class="flex items-center border-b border-neutral-500 text-sm hover:bg-black/10 relative"
        >
            <div thead class="min-w-0 w-10">
                <mat-checkbox></mat-checkbox>
            </div>
            <div thead>{{ item.name }}</div>
            <div thead>{{ item.building_id }}</div>
            <div thead>{{ item.brand }}</div>
            <div thead>{{ item.category }}</div>
            <div thead>{{ item.barcode }}</div>
            <div thead>{{ item.purchase_date }}</div>
            <div thead>{{ item.good_until }}</div>
            <div thead>{{ item.consumable ? 'YES' : 'NO' }}</div>
            <div thead>{{ item.quantity }}</div>
            <div thead>{{ item.remind_returns ? 'YES' : 'NO' }}</div>
            <div thead>{{ item.reminder_delay }}</div>
            <div thead>{{ item.available_for_desks ? 'YES' : 'NO' }}</div>
            <div thead>{{ item.available_for_spaces ? 'YES' : 'NO' }}</div>
            <div
                actions
                class="absolute top-1/2 -translate-y-1/2 left-12 rounded-3xl flex items-center bg-white dark:bg-neutral-700 shadow !p-0 min-w-0 w-auto"
            >
                <button mat-icon-button matTooltip="Edit Room" (click)="edit()">
                    <app-icon>edit</app-icon>
                </button>
                <button
                    mat-icon-button
                    matTooltip="Delete Room"
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
export class AssetDetailsComponent {
    @Input() public item: Asset;

    public readonly edit = () => this._service.openAssetModal(this.item);
    public readonly remove = () => this._service.removeAsset(this.item);

    constructor(private _service: AssetsService) {}
}
