import { Component, computed, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatTooltip } from '@angular/material/tooltip';
import { IconComponent } from '../../../../../libs/components/src/lib/icon.component';
import { Zone, ZonesService } from './zoning.service';

@Component({
    selector: `zone-details,[zone-details]`,
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
            <div thead>{{ item().name }}</div>
            <div thead>{{ item().building_id }}</div>
            <div thead>{{ item().level_id }}</div>
            <div thead>{{ item().capacity }}</div>
            <div thead class="w-64">
                {{ item().whitelist_groups?.join() || 'NONE' }}
            </div>
            <div thead>{{ item().people_counting ? 'YES' : 'NO' }}</div>
            <div thead>{{ item().counting_method }}</div>
            <div thead>{{ item().people_finding ? 'YES' : 'NO' }}</div>
            <div thead>{{ item().finding_method }}</div>
            <div thead>{{ item().locatable_firewarden ? 'YES' : 'NO' }}</div>
            <div thead>{{ item().locatable_firstaiders ? 'YES' : 'NO' }}</div>
            <div thead>{{ item().locatable_marshall ? 'YES' : 'NO' }}</div>
            <div
                actions
                class="absolute top-1/2 left-12 flex w-auto min-w-0 -translate-y-1/2 items-center rounded-3xl bg-white !p-0 shadow dark:bg-neutral-700"
            >
                <button mat-icon-button matTooltip="Edit Zone" (click)="edit()">
                    <app-icon>edit</app-icon>
                </button>
                <button
                    mat-icon-button
                    matTooltip="Delete Zone"
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
export class ZoneDetailsComponent {
    private _service = inject(ZonesService);

    public readonly item = input<Zone>(undefined);

    public readonly edit = () => this._service.openZoneModal(this.item());
    public readonly remove = () => this._service.removeZone(this.item());
    public readonly setSelected = (s) =>
        this._service.setSelected(this.item().id, s);

    public readonly selected = computed(() => {
        return this._service.isSelected(this.item().id);
    });
}
