import { Component } from '@angular/core';
import { OrganisationService } from './organisation.service';

@Component({
    selector: 'app-organisation',
    template: `
        <div class="flex flex-col h-full w-full overflow-hidden">
            <header class="bg-neutral-700 p-2 space-x-2">
                <button mat-button class="w-32">
                    Add Building
                </button>
                <button mat-button class="w-32">
                    Add Level
                </button>
            </header>
            <main class="w-full h-1/2 flex-1 overflow-auto">
                <div table>
                    <div
                        class="sticky top-0 flex items-center bg-neutral-800 border-b border-neutral-500 w-full"
                    >
                        <div thead class="min-w-0">
                            <mat-checkbox></mat-checkbox>
                        </div>
                        <div
                            thead
                            class="min-w-0 w-10 text-black/0 select-none h-full"
                        >
                            Actions
                        </div>
                        <div thead class="w-56">Display Name</div>
                        <div thead>Country</div>
                        <div thead>City</div>
                        <div thead class="w-56">Street Address</div>
                        <div thead>Floors</div>
                        <div thead>Currency</div>
                        <div thead>Visitors?</div>
                        <div thead>Catering?</div>
                    </div>
                    <ng-container
                        *ngIf="(buildings | async)?.length; else empty_state"
                    >
                        <div org-building
                            *ngFor="let bld of buildings | async"
                            [building]="bld"
                        ></div>
                    </ng-container>
                </div>
            </main>
        </div>
        <ng-template #empty_state>
            <div class="w-full h-full flex items-center justify-center">
                <p>No buildings setup for organisation</p>
            </div>
        </ng-template>
    `,
    styles: [
        `
            [table] {
                width: 72.5rem;
            }

            [thead] {
                min-width: 6rem;
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
export class OrganisationComponent {
    public readonly buildings = this._org.buildings;

    constructor(private _org: OrganisationService) {}
}
