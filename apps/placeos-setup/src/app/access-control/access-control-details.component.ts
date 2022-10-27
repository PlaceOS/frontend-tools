import { Component, Input } from '@angular/core';
import { Building, OrganisationService } from '../organisation/organisation.service';
import { AccessControl, AccessControlService } from './access-control.service';

@Component({
    selector: `access-control-details,[access-control-details]`,
    template: `
        <div
            details
            class="flex items-center border-b border-neutral-500 text-sm hover:bg-black/10 relative"
        >
            <div thead class="min-w-0 w-10">
                <mat-checkbox [ngModel]="selected" (ngModelChange)="setSelected($event)"></mat-checkbox>
            </div>
            <div thead>{{ item.type }}</div>
            <div thead>{{ item.building_id }}</div>
            <div thead>{{ item.managed_onsite ? 'YES' : 'NO' }}</div>
            <div thead>{{ item.isolated ? 'YES' : 'NO' }}</div>
            <div thead>{{ item.linked_to_staff_db ? 'YES' : 'NO' }}</div>
            <div thead>{{ item.access_tied_to_identity ? 'YES' : 'NO' }}</div>
            <div
                actions
                class="absolute top-1/2 -translate-y-1/2 left-12 rounded-3xl flex items-center bg-white dark:bg-neutral-700 shadow !p-0 min-w-0 w-auto"
            >
                <button mat-icon-button matTooltip="Edit Settings" (click)="edit()">
                    <app-icon>edit</app-icon>
                </button>
                <button mat-icon-button matTooltip="Delete Settings" (click)="remove()">
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
export class AccessControlDetailsComponent {
    @Input() public item: AccessControl;

    public readonly edit = () => this._service.openAccessControlModal(this.item);
    public readonly remove = () => this._service.removeAccessControl(this.item);
    public readonly setSelected = (s) => this._service.setSelected(this.item.id, s);

    public get selected() {
        return this._service.isSelected(this.item.id);
    }

    constructor(private _service: AccessControlService) {}
}
