import { Component } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { SpacesService } from './spaces.service';

@Component({
    selector: 'app-organisation',
    template: `
        <div class="flex flex-col h-full w-full overflow-hidden">
            <header class="bg-neutral-700 p-2 space-x-2">
                <button mat-button class="w-32" (click)="newSpace()">
                    Add Room
                </button>
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
                        <div thead>Room ID</div>
                        <div thead class="w-56">Display Name</div>
                        <div thead>Name</div>
                        <div thead>Building</div>
                        <div thead>Level</div>
                        <div thead class="w-56">Resource Email</div>
                        <div thead>Capacity</div>
                        <div thead>Type</div>
                        <div thead class="w-64">Features</div>
                        <div thead>Pets?</div>
                        <div thead>Catering?</div>
                        <div thead>Approval?</div>
                        <div thead>Visitors?</div>
                        <div thead class="w-64">Access Groups</div>
                        <div thead>Auto Release?</div>
                        <div thead>Release Delay</div>
                        <div thead class="w-32">Sensor Brand</div>
                        <div thead>Recurring Bookings?</div>
                        <div thead>Max Recurrences</div>
                        <div thead>All Day Bookings?</div>
                        <div thead>Images</div>
                    </div>
                    <ng-container
                        *ngIf="(spaces | async)?.length; else empty_state"
                    >
                        <div
                            space-details
                            *ngFor="let item of spaces | async"
                            [item]="item"
                        ></div>
                    </ng-container>
                </div>
            </main>
        </div>
        <ng-template #empty_state>
            <div class="w-full h-full flex items-center justify-center p-8">
                <p class="opacity-60">No rooms setup for organisation</p>
            </div>
        </ng-template>
    `,
    styles: [
        `
            [table] {
                width: 166.5rem;
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
})
export class SpacesComponent {
    public readonly spaces = this._service.spaces;

    public readonly newSpace = () => this._service.openSpaceModal();
    public readonly setSelected = (s) => this._service.setSelected('*', s);
    public readonly all_selected = combineLatest([
        this._service.spaces,
        this._service.selected,
    ]).pipe(map(([l, s]) => l.length === s.length && s.length > 0));
    public readonly some_selected = combineLatest([
        this._service.spaces,
        this._service.selected,
    ]).pipe(map(([l, s]) => l.length !== s.length && s.length > 0));

    constructor(private _service: SpacesService) {}
}
