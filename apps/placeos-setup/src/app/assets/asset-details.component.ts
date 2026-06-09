import { Component, Input } from '@angular/core';
import {
    Building,
    OrganisationService,
} from '../organisation/organisation.service';
import { Asset, AssetsService } from './assets.service';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { IconComponent } from '../../../../../libs/components/src/lib/icon.component';

@Component({
    selector: `asset-details,[asset-details]`,
    template: `
        <div
            details
            class="flex items-center border-b border-neutral-500 text-sm hover:bg-black/10 relative"
        >
            <div thead class="min-w-0 w-10">
                <mat-checkbox
                    [ngModel]="selected"
                    (ngModelChange)="setSelected($event)"
                ></mat-checkbox>
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
                <button
                    mat-icon-button
                    matTooltip="Edit Asset"
                    (click)="edit()"
                >
                    <app-icon>edit</app-icon>
                </button>
                <button
                    mat-icon-button
                    matTooltip="Delete Asset"
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
export class AssetDetailsComponent {
    @Input() public item: Asset;

    public readonly edit = () => this._service.openAssetModal(this.item);
    public readonly remove = () => this._service.removeAsset(this.item);
    public readonly setSelected = (s) =>
        this._service.setSelected(this.item.id, s);

    public get selected() {
        return this._service.isSelected(this.item.id);
    }

    constructor(private _service: AssetsService) {}
}
