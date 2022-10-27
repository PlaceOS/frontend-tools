import { Component } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { InterfacesService } from './interfaces.service';

@Component({
    selector: 'app-interfaces',
    template: `
        <div class="flex flex-col h-full w-full overflow-hidden">
            <header class="bg-neutral-700 p-2 space-x-2">
                <button mat-button class="w-64" (click)="newInterface()">
                    Add Custom Interface Config
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
                        <div thead>Interface ID</div>
                        <div thead class="w-48">Building</div>
                        <div thead>Workplace App</div>
                        <div thead>Concierge App</div>
                        <div thead>Booking Panel</div>
                        <div thead>Visitor Kiosk</div>
                        <div thead>Map Kiosk</div>
                        <div thead>Outlook Plugin</div>
                    </div>
                    <ng-container
                        *ngIf="(interfaces | async)?.length; else empty_state"
                    >
                        <div
                            interface-details
                            *ngFor="let item of interfaces | async"
                            [item]="item"
                        ></div>
                    </ng-container>
                </div>
            </main>
        </div>
        <ng-template #empty_state>
            <div class="w-full h-full flex items-center justify-center p-8">
                <p class="opacity-60">No interface settings for organisation</p>
            </div>
        </ng-template>
    `,
    styles: [
        `
            [table] {
                width: 72rem;
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
})
export class InterfacesComponent {
    public readonly interfaces = this._service.interfaces;

    public readonly newInterface = () => this._service.openInterfaceModal();
    public readonly setSelected = (s) => this._service.setSelected('*', s);
    public readonly all_selected = combineLatest([
        this._service.interfaces,
        this._service.selected,
    ]).pipe(map(([l, s]) => l.length === s.length));
    public readonly some_selected = combineLatest([
        this._service.interfaces,
        this._service.selected,
    ]).pipe(map(([l, s]) => l.length !== s.length && s.length > 0));

    constructor(private _service: InterfacesService) {}
}
