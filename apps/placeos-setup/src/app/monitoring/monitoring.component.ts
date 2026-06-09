import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { DataWarningComponent } from '../components/data-warning.component';
import { MonitoringItemDetailsComponent } from './item-details.component';
import { MonitoringService } from './monitoring.service';

@Component({
    selector: 'app-monitoring',
    template: `
        <div class="relative flex h-full w-full flex-col overflow-hidden">
            <header class="space-x-2 bg-neutral-700 p-2">
                <button mat-button class="w-[18rem]" (click)="newLocker()">
                    Add Environmental Monitoring Region
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
                        <div thead class="w-48">Building</div>
                        <div thead class="w-48">Level</div>
                        <div thead>Monitoring Required?</div>
                        <div thead class="w-32">Sensor Brand</div>
                        <div thead>Sensor Locations in Map?</div>
                        <div thead>Display locations for Users?</div>
                        <div thead>Sensor data available in analytics?</div>
                    </div>
                    @if (items()?.length) {
                        @for (item of items(); track item) {
                            <div monitoring-item-details [item]="item"></div>
                        }
                    } @else {
                        <div
                            class="flex h-full w-full items-center justify-center p-8"
                        >
                            <p class="opacity-60">
                                No environmental monitoring setup for
                                organisation
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
                width: 69rem;
            }

            [thead] {
                min-width: 8rem;
                width: 8rem;
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
        MonitoringItemDetailsComponent,
        DataWarningComponent,
    ],
})
export class MonitoringComponent {
    private _service = inject(MonitoringService);

    public readonly items = this._service.item_list;

    public readonly newLocker = () => this._service.openItemModal();
    public readonly setSelected = (s) => this._service.setSelected('*', s);
    public readonly removeSelected = () => this._service.removeSelected();
    public readonly all_selected = computed(() => {
        const list = this._service.item_list();
        const selected = this._service.selected();
        return list.length === selected.length && selected.length > 0;
    });
    public readonly some_selected = computed(() => {
        const list = this._service.item_list();
        const selected = this._service.selected();
        return list.length !== selected.length && selected.length > 0;
    });
}
