import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { DataWarningComponent } from '../components/data-warning.component';
import { ZoneDetailsComponent } from './zone-details.component';
import { ZonesService } from './zoning.service';

@Component({
    selector: 'app-organisation',
    template: `
        <div class="relative flex h-full w-full flex-col overflow-hidden">
            <header class="space-x-2 bg-neutral-700 p-2">
                <button mat-button class="w-32" (click)="newZone()">
                    Add Zone
                </button>
                @if (all_selected() || some_selected()) {
                    <button mat-button class="w-48" (click)="removeSelected()">
                        Remove Selected
                    </button>
                }
            </header>
            <main class="h-1/2 w-full flex-1 overflow-auto">
                <div table>
                    <div
                        class="sticky top-0 flex w-full items-center border-b border-neutral-500 bg-neutral-800"
                    >
                        <div thead class="w-10 min-w-0">
                            <mat-checkbox
                                [ngModel]="all_selected()"
                                [indeterminate]="some_selected()"
                                (ngModelChange)="setSelected($event)"
                            />
                        </div>
                        <div thead>Name</div>
                        <div thead>Building</div>
                        <div thead>Level</div>
                        <div thead>Capacity</div>
                        <div thead class="w-64">Access Groups</div>
                        <div thead>People Counting?</div>
                        <div thead>Counting Method</div>
                        <div thead>People Finding?</div>
                        <div thead>Finding Method</div>
                        <div thead>Locate Firewardens</div>
                        <div thead>Locate First Aiders</div>
                        <div thead>Locate COVID Marshalls</div>
                    </div>
                    @if (zones()?.length) {
                        @for (item of zones(); track item) {
                            <div zone-details [item]="item"></div>
                        }
                    } @else {
                        <div
                            class="flex h-full w-full items-center justify-center p-8"
                        >
                            <p class="opacity-60">
                                No zones setup for organisation
                            </p>
                        </div>
                    }
                </div>
            </main>
            <data-warning [levels]="true" />
        </div>
    `,
    styles: [
        `
            [table] {
                width: 86rem;
            }

            [thead] {
                min-width: 6rem;
                width: 6rem;
                padding: 1rem;
                font-weight: 500;
                flex-shrink: 0;
            }

            [org-building]:nth-child(2n) {
                background-color: #00000008;
            }
        `,
    ],
    imports: [
        MatButton,
        MatCheckbox,
        FormsModule,
        ZoneDetailsComponent,
        DataWarningComponent,
    ],
})
export class ZonesComponent {
    private _service = inject(ZonesService);

    public readonly zones = this._service.zones;

    public readonly newZone = () => this._service.openZoneModal();
    public readonly setSelected = (s) => this._service.setSelected('*', s);
    public readonly removeSelected = () => this._service.removeSelected();
    public readonly all_selected = computed(() => {
        const list = this._service.zones();
        const selected = this._service.selected();
        return list.length === selected.length && selected.length > 0;
    });
    public readonly some_selected = computed(() => {
        const list = this._service.zones();
        const selected = this._service.selected();
        return list.length !== selected.length && selected.length > 0;
    });
}
