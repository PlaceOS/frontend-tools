import { Component } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { LockersService } from './lockers.service';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { LockerDetailsComponent } from './locker-details.component';
import { DataWarningComponent } from '../components/data-warning.component';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-lockers',
    template: `
        <div class="flex flex-col h-full w-full overflow-hidden relative">
            <header class="bg-neutral-700 p-2 space-x-2">
                <button mat-button class="w-32" (click)="newLocker()">
                    Add Locker
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
                            <mat-checkbox
                                [ngModel]="all_selected | async"
                                [indeterminate]="some_selected | async"
                                (ngModelChange)="setSelected($event)"
                            ></mat-checkbox>
                        </div>
                        <div thead>Locker ID</div>
                        <div thead class="w-56">Display Name</div>
                        <div thead>Name</div>
                        <div thead>Building</div>
                        <div thead>Level</div>
                        <div thead>Zone</div>
                        <div thead class="w-64">Features</div>
                        <div thead class="w-64">Access Groups</div>
                        <div thead>Bookable?</div>
                        <div thead>Approval?</div>
                        <div thead>Auto Release?</div>
                        <div thead>Release Delay</div>
                        <div thead class="w-32">Sensor Brand</div>
                        <div thead>Recurring Bookings?</div>
                        <div thead>Max Recurrences</div>
                    </div>
                    @if ((lockers | async)?.length) { @for (item of lockers |
                    async; track item) {
                    <div locker-details [item]="item"></div>
                    } } @else {
                    <div
                        class="w-full h-full flex items-center justify-center p-8"
                    >
                        <p class="opacity-60">
                            No lockers setup for organisation
                        </p>
                    </div>
                    }
                </div>
            </main>
            <data-warning [levels]="true"></data-warning>
        </div>
    `,
    styles: [
        `
            [table] {
                width: 126.5rem;
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
        LockerDetailsComponent,
        DataWarningComponent,
        AsyncPipe,
    ],
})
export class LockersComponent {
    public readonly lockers = this._service.lockers;

    public readonly newLocker = () => this._service.openLockerModal();
    public readonly setSelected = (s) => this._service.setSelected('*', s);
    public readonly removeSelected = () => this._service.removeSelected();
    public readonly all_selected = combineLatest([
        this._service.lockers,
        this._service.selected,
    ]).pipe(map(([l, s]) => l.length === s.length && s.length > 0));
    public readonly some_selected = combineLatest([
        this._service.lockers,
        this._service.selected,
    ]).pipe(map(([l, s]) => l.length !== s.length && s.length > 0));

    constructor(private _service: LockersService) {}
}
