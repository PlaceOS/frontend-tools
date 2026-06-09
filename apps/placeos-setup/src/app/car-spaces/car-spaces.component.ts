import { Component, inject } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { CarSpacesService } from './car-spaces.service';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { CarSpaceDetailsComponent } from './car-space-details.component';
import { DataWarningComponent } from '../components/data-warning.component';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-car-spaces',
    template: `
        <div class="flex flex-col h-full w-full overflow-hidden relative">
            <header class="bg-neutral-700 p-2 space-x-2">
                <button mat-button class="w-32" (click)="newCarSpace()">
                    Add Car space
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
                        <div thead>Space ID</div>
                        <div thead>Name</div>
                        <div thead>Building</div>
                        <div thead>Level</div>
                        <div thead>Vehicle Type</div>
                        <div thead class="w-64">Access Groups</div>
                        <div thead class="w-64">Features</div>
                        <div thead>Plate Recognition?</div>
                        <div thead>Bookable?</div>
                        <div thead>Auto Release?</div>
                        <div thead>Release Delay</div>
                        <div thead class="w-32">Sensor Brand</div>
                        <div thead>Recurring Bookings?</div>
                        <div thead>Max Recurrences</div>
                    </div>
                    @if ((spaces | async)?.length) { @for (item of spaces |
                    async; track item) {
                    <div car-space-details [item]="item"></div>
                    } } @else {
                    <div
                        class="w-full h-full flex items-center justify-center p-8"
                    >
                        <p class="opacity-60">
                            No parking spaces setup for organisation
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
                width: 112rem;
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
        CarSpaceDetailsComponent,
        DataWarningComponent,
        AsyncPipe,
    ],
})
export class CarSpacesComponent {
    private _service = inject(CarSpacesService);

    public readonly spaces = this._service.spaces;

    public readonly newCarSpace = () => this._service.openCarSpaceModal();
    public readonly setSelected = (s) => this._service.setSelected('*', s);
    public readonly removeSelected = () => this._service.removeSelected();
    public readonly all_selected = combineLatest([
        this._service.spaces,
        this._service.selected,
    ]).pipe(map(([l, s]) => l.length === s.length && s.length > 0));
    public readonly some_selected = combineLatest([
        this._service.spaces,
        this._service.selected,
    ]).pipe(map(([l, s]) => l.length !== s.length && s.length > 0));
}
