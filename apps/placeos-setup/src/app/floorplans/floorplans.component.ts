import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { FloorPlanExampleModalComponent } from './example-modal.component';
import { FloorPlansService } from './floorplans.service';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { FloorPlanDetailsComponent } from './floorplan-details.component';
import { DataWarningComponent } from '../components/data-warning.component';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-organisation',
    template: `
        <div class="flex flex-col h-full w-full overflow-hidden relative">
            <header class="bg-neutral-700 p-2 space-x-2">
                <button mat-button class="w-32" (click)="newFloorPlan()">
                    Add Floor Plan
                </button>
                <button mat-button class="w-44" (click)="viewExample()">
                    View Example Map
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
                        <div thead>Building</div>
                        <div thead>Level</div>
                        <div thead>Map File Available?</div>
                        <div thead>Fix locations setup?</div>
                        <div thead>Zones setup?</div>
                        <div thead>Sensors setup?</div>
                    </div>
                    @if ((floorplans | async)?.length) { @for (item of
                    floorplans | async; track item) {
                    <div floorplan-details [item]="item"></div>
                    } } @else {
                    <div
                        class="w-full h-full flex items-center justify-center p-8"
                    >
                        <p class="opacity-60">
                            No floor plans setup for organisation
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
    imports: [
        MatButton,
        MatCheckbox,
        FormsModule,
        FloorPlanDetailsComponent,
        DataWarningComponent,
        AsyncPipe,
    ],
})
export class FloorPlansComponent {
    private _service = inject(FloorPlansService);
    private _dialog = inject(MatDialog);

    public readonly floorplans = this._service.floorplans;

    public readonly newFloorPlan = () => this._service.openFloorPlanModal();
    public readonly setSelected = (s) => this._service.setSelected('*', s);
    public readonly removeSelected = () => this._service.removeSelected();
    public readonly all_selected = combineLatest([
        this._service.floorplans,
        this._service.selected,
    ]).pipe(map(([l, s]) => l.length === s.length && s.length > 0));
    public readonly some_selected = combineLatest([
        this._service.floorplans,
        this._service.selected,
    ]).pipe(map(([l, s]) => l.length !== s.length && s.length > 0));

    public viewExample() {
        this._dialog.open(FloorPlanExampleModalComponent);
    }
}
