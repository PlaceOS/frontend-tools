import { Component, inject } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { MonitoringService } from './monitoring.service';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MonitoringItemDetailsComponent } from './item-details.component';
import { DataWarningComponent } from '../components/data-warning.component';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-monitoring',
    template: `
        <div class="flex flex-col h-full w-full overflow-hidden relative">
            <header class="bg-neutral-700 p-2 space-x-2">
                <button mat-button class="w-[18rem]" (click)="newLocker()">
                    Add Environmental Monitoring Region
                </button>
                @if ((all_selected | async) || (some_selected | async)) {
                <button mat-button class="w-48" (click)="removeSelected()">
                    Remove Selected
                </button>
                }
            </header>
            <main class="w-full h-1/2 flex-1 overflow-auto">
                <div table>
                    <div
                        class="sticky top-0 flex items-center bg-neutral-800 border-b border-neutral-500 w-full"
                    >
                        <div thead class="min-w-0 w-10">
                            <mat-checkbox [ngModel]="all_selected | async"
                                [indeterminate]="some_selected | async"
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
                    @if ((items | async)?.length) { @for (item of items | async;
                    track item) {
                    <div monitoring-item-details [item]="item"></div>
                    } } @else {
                    <div
                        class="w-full h-full flex items-center justify-center p-8"
                    >
                        <p class="opacity-60">
                            No environmental monitoring setup for organisation
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
        AsyncPipe,
    ],
})
export class MonitoringComponent {
    private _service = inject(MonitoringService);

    public readonly items = this._service.item_list;

    public readonly newLocker = () => this._service.openItemModal();
    public readonly setSelected = (s) => this._service.setSelected('*', s);
    public readonly removeSelected = () => this._service.removeSelected();
    public readonly all_selected = combineLatest([
        this._service.item_list,
        this._service.selected,
    ]).pipe(map(([l, s]) => l.length === s.length && s.length > 0));
    public readonly some_selected = combineLatest([
        this._service.item_list,
        this._service.selected,
    ]).pipe(map(([l, s]) => l.length !== s.length && s.length > 0));
}
