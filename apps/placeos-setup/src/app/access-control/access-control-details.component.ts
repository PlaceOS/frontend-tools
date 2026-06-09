import { Component, computed, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatTooltip } from '@angular/material/tooltip';
import { IconComponent } from '../../../../../libs/components/src/lib/icon.component';
import { AccessControl, AccessControlService } from './access-control.service';

@Component({
    selector: `access-control-details,[access-control-details]`,
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
            <div thead>{{ item().type }}</div>
            <div thead>{{ item().building_id }}</div>
            <div thead>{{ item().managed_onsite ? 'YES' : 'NO' }}</div>
            <div thead>{{ item().isolated ? 'YES' : 'NO' }}</div>
            <div thead>{{ item().linked_to_staff_db ? 'YES' : 'NO' }}</div>
            <div thead>{{ item().access_tied_to_identity ? 'YES' : 'NO' }}</div>
            <div
                actions
                class="absolute top-1/2 left-12 flex w-auto min-w-0 -translate-y-1/2 items-center rounded-3xl bg-white !p-0 shadow dark:bg-neutral-700"
            >
                <button
                    mat-icon-button
                    matTooltip="Edit Settings"
                    (click)="edit()"
                >
                    <app-icon>edit</app-icon>
                </button>
                <button
                    mat-icon-button
                    matTooltip="Delete Settings"
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
    ],
    imports: [
        MatCheckbox,
        FormsModule,
        MatIconButton,
        MatTooltip,
        IconComponent,
    ],
})
export class AccessControlDetailsComponent {
    private _service = inject(AccessControlService);

    public readonly item = input<AccessControl>(undefined);

    public readonly edit = () =>
        this._service.openAccessControlModal(this.item());
    public readonly remove = () =>
        this._service.removeAccessControl(this.item());
    public readonly setSelected = (s) =>
        this._service.setSelected(this.item().id, s);

    public readonly selected = computed(() => {
        return this._service.isSelected(this.item().id);
    });
}
