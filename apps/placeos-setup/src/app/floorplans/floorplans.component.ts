import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { DataWarningComponent } from '../components/data-warning.component';
import { FloorPlanExampleModalComponent } from './example-modal.component';
import { FloorPlanDetailsComponent } from './floorplan-details.component';
import { FloorPlansService } from './floorplans.service';

@Component({
    selector: 'app-organisation',
    template: `
        <div class="relative flex h-full w-full flex-col overflow-hidden">
            <header class="space-x-2 bg-neutral-700 p-2">
                <button mat-button class="w-32" (click)="newFloorPlan()">
                    Add Floor Plan
                </button>
                <button mat-button class="w-44" (click)="viewExample()">
                    View Example Map
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
                        <div thead>Building</div>
                        <div thead>Level</div>
                        <div thead>Map File Available?</div>
                        <div thead>Fix locations setup?</div>
                        <div thead>Zones setup?</div>
                        <div thead>Sensors setup?</div>
                    </div>
                    @if (floorplans()?.length) {
                        @for (item of floorplans(); track item) {
                            <div floorplan-details [item]="item"></div>
                        }
                    } @else {
                        <div
                            class="flex h-full w-full items-center justify-center p-8"
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
    ],
})
export class FloorPlansComponent {
    private _service = inject(FloorPlansService);
    private _dialog = inject(MatDialog);

    public readonly floorplans = this._service.floorplans;

    public readonly newFloorPlan = () => this._service.openFloorPlanModal();
    public readonly setSelected = (s) => this._service.setSelected('*', s);
    public readonly removeSelected = () => this._service.removeSelected();
    public readonly all_selected = computed(() => {
        const list = this._service.floorplans();
        const selected = this._service.selected();
        return list.length === selected.length && selected.length > 0;
    });
    public readonly some_selected = computed(() => {
        const list = this._service.floorplans();
        const selected = this._service.selected();
        return list.length !== selected.length && selected.length > 0;
    });

    public viewExample() {
        this._dialog.open(FloorPlanExampleModalComponent);
    }
}
