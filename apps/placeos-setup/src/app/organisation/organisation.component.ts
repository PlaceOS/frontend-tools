import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { ActivatedRoute } from '@angular/router';
import { BaseClass } from '@placeos-tools/common';
import { BuildingComponent } from './building.component';
import { OrganisationService } from './organisation.service';

@Component({
    selector: 'app-organisation',
    template: `
        <div class="relative flex h-full w-full flex-col overflow-hidden">
            <header class="space-x-2 bg-neutral-700 p-2">
                <button mat-button class="w-32" (click)="newBuilding()">
                    Add Building
                </button>
                <button
                    mat-button
                    class="w-32"
                    [disabled]="!buildings()?.length"
                    (click)="newLevel()"
                >
                    Add Level
                </button>
            </header>
            <main class="h-1/2 w-full flex-1 overflow-auto">
                <div table>
                    <div
                        class="sticky top-0 flex w-full items-center border-b border-neutral-500 bg-neutral-800"
                    >
                        <div thead class="min-w-0">
                            <mat-checkbox
                                [ngModel]="all_selected()"
                                [indeterminate]="some_selected()"
                                (ngModelChange)="setSelected($event)"
                            />
                        </div>
                        <div
                            thead
                            class="h-full w-10 min-w-0 text-black/0 select-none"
                        >
                            Actions
                        </div>
                        <div thead class="w-56">Display Name</div>
                        <div thead>Country</div>
                        <div thead class="w-32">City</div>
                        <div thead class="w-56">Street Address</div>
                        <div thead>Floors</div>
                        <div thead>Currency</div>
                        <div thead>Visitors?</div>
                        <div thead>Catering?</div>
                    </div>
                    @if (buildings()?.length) {
                        @for (bld of buildings(); track bld) {
                            <div org-building [building]="bld"></div>
                        }
                    } @else {
                        <div
                            class="flex h-full w-full items-center justify-center p-8"
                        >
                            <p class="opacity-60">
                                No buildings setup for organisation
                            </p>
                        </div>
                    }
                </div>
            </main>
        </div>
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
    imports: [MatButton, MatCheckbox, FormsModule, BuildingComponent],
})
export class OrganisationComponent extends BaseClass {
    private _org = inject(OrganisationService);
    private _route = inject(ActivatedRoute);

    public readonly buildings = this._org.buildings;

    public readonly newBuilding = () => this._org.openBuildingModal();
    public readonly newLevel = () => this._org.openLevelModal();
    public readonly setSelected = (s) => this._org.setSelected('*', s);
    public readonly all_selected = computed(() => {
        const total = this._org.buildings().length + this._org.levels().length;
        const selected = this._org.selected().length;
        return total === selected && selected > 0;
    });
    public readonly some_selected = computed(() => {
        const total = this._org.buildings().length + this._org.levels().length;
        const selected = this._org.selected().length;
        return total !== selected && selected > 0;
    });

    public ngOnInit() {
        this.subscription(
            'route.query',
            this._route.queryParamMap.subscribe((params) => {
                if (params.has('add')) {
                    if (params.get('add') === 'building') {
                        this.newBuilding();
                    } else if (params.get('add') === 'level') {
                        this.newLevel();
                    }
                }
            }),
        );
    }
}
