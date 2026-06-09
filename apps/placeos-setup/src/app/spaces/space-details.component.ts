import { Component, inject, input } from '@angular/core';
import {
    Building,
    OrganisationService,
} from '../organisation/organisation.service';
import { Space, SpacesService } from './spaces.service';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { IconComponent } from '../../../../../libs/components/src/lib/icon.component';

@Component({
    selector: `space-details,[space-details]`,
    template: `
        <div
            details
            class="flex items-center border-b border-neutral-500 text-sm hover:bg-black/10 relative"
        >
            <div thead class="min-w-0 w-10">
                <mat-checkbox [ngModel]="selected"
                    (ngModelChange)="setSelected($event)"
                 />
            </div>
            <div thead class="font-mono text-xs">{{ item().room_id }}</div>
            <div thead class="w-56">{{ item().display_name }}</div>
            <div thead>{{ item().name }}</div>
            <div thead>{{ item().building_id }}</div>
            <div thead>{{ item().level_id }}</div>
            <div thead class="w-56">{{ item().email }}</div>
            <div thead>{{ item().capacity || '0' }}</div>
            <div thead>{{ item().type }}</div>
            <div thead class="w-64">
                {{ item().features?.join() || 'NONE' }}
            </div>
            <div thead>{{ item().pets_allowed ? 'YES' : 'NO' }}</div>
            <div thead>{{ item().catering_available ? 'YES' : 'NO' }}</div>
            <div thead>{{ item().requires_approval ? 'YES' : 'NO' }}</div>
            <div thead>{{ item().visitors ? 'YES' : 'NO' }}</div>
            <div thead class="w-64">
                {{ item().whitelist_groups?.join() || 'NONE' }}
            </div>
            <div thead>{{ item().auto_release ? 'YES' : 'NO' }}</div>
            <div thead>{{ item().auto_release_delay || '10' }} minutes</div>
            <div thead class="w-32">{{ item().sensor_brand }}</div>
            <div thead>{{ item().recurrence ? 'YES' : 'NO' }}</div>
            <div thead>{{ item().max_recurrence }}</div>
            <div thead>{{ item().all_day ? 'YES' : 'NO' }}</div>
            <div thead>{{ item().images ? 'YES' : 'NO' }}</div>
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
export class SpaceDetailsComponent {
    private _service = inject(SpacesService);

    public readonly item = input<Space>(undefined);

    public readonly edit = () => this._service.openSpaceModal(this.item());
    public readonly remove = () => this._service.removeSpace(this.item());
    public readonly setSelected = (s) =>
        this._service.setSelected(this.item().id, s);

    public get selected() {
        return this._service.isSelected(this.item().id);
    }
}
