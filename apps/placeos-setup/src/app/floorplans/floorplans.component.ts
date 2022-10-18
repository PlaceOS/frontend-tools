import { Component } from '@angular/core';
import { FloorPlansService } from './floorplans.service';

@Component({
    selector: 'app-organisation',
    template: `
        <div class="flex flex-col h-full w-full overflow-hidden">
            <header class="bg-neutral-700 p-2 space-x-2">
                <button mat-button class="w-32" (click)="newFloorPlan()">
                    Add Floor Plan
                </button>
            </header>
            <main class="w-full h-1/2 flex-1 overflow-auto">
                <div table>
                    <div
                        class="sticky top-0 flex items-center bg-neutral-800 border-b border-neutral-500 w-full"
                    >
                        <div thead class="min-w-0 w-10">
                            <mat-checkbox></mat-checkbox>
                        </div>
                        <div thead>Building</div>
                        <div thead>Level</div>
                        <div thead>Map File Available?</div>
                        <div thead>Fix locations setup?</div>
                        <div thead>Zones setup?</div>
                        <div thead>Sensors setup?</div>
                    </div>
                    <ng-container
                        *ngIf="(floorplans | async)?.length; else empty_state"
                    >
                        <div
                            floorplan-details
                            *ngFor="let item of floorplans | async"
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
                width: 64rem;
            }

            [thead] {
                min-width: 10rem;
                width: 10rem;
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
export class FloorPlansComponent {
    public readonly floorplans = this._service.floorplans;

    public readonly newFloorPlan = () => this._service.openFloorPlanModal();

    constructor(private _service: FloorPlansService) {}
}
