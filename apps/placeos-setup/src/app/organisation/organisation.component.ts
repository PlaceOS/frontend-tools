import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseClass } from '@placeos-tools/common';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { OrganisationService } from './organisation.service';

@Component({
    selector: 'app-organisation',
    template: `
        <div class="flex flex-col h-full w-full overflow-hidden">
            <header class="bg-neutral-700 p-2 space-x-2">
                <button mat-button class="w-32" (click)="newBuilding()">
                    Add Building
                </button>
                <button
                    mat-button
                    class="w-32"
                    [disabled]="!(buildings | async)?.length"
                    (click)="newLevel()"
                >
                    Add Level
                </button>
            </header>
            <main class="w-full h-1/2 flex-1 overflow-auto">
                <div table>
                    <div
                        class="sticky top-0 flex items-center bg-neutral-800 border-b border-neutral-500 w-full"
                    >
                        <div thead class="min-w-0">
                            <mat-checkbox
                                [ngModel]="all_selected | async"
                                [indeterminate]="some_selected | async"
                                (ngModelChange)="setSelected($event)"
                            ></mat-checkbox>
                        </div>
                        <div
                            thead
                            class="min-w-0 w-10 text-black/0 select-none h-full"
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
                    <ng-container
                        *ngIf="(buildings | async)?.length; else empty_state"
                    >
                        <div
                            org-building
                            *ngFor="let bld of buildings | async"
                            [building]="bld"
                        ></div>
                    </ng-container>
                </div>
            </main>
        </div>
        <ng-template #empty_state>
            <div class="w-full h-full flex items-center justify-center p-8">
                <p class="opacity-60">No buildings setup for organisation</p>
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
export class OrganisationComponent extends BaseClass {
    public readonly buildings = this._org.buildings;

    public readonly newBuilding = () => this._org.openBuildingModal();
    public readonly newLevel = () => this._org.openLevelModal();
    public readonly setSelected = (s) => this._org.setSelected('*', s);
    public readonly all_selected = combineLatest([
        this._org.buildings,
        this._org.levels,
        this._org.selected,
    ]).pipe(map(([b, l, s]) => (b.length + l.length) === s.length && s.length > 0));
    public readonly some_selected = combineLatest([
        this._org.buildings,
        this._org.levels,
        this._org.selected,
    ]).pipe(map(([b, l, s]) => (b.length + l.length) !== s.length && s.length > 0));

    constructor(private _org: OrganisationService, private _route: ActivatedRoute) {
        super();
    }

    public ngOnInit() {
        this.subscription('route.query', this._route.queryParamMap.subscribe((params) => {
            if (params.has('add')) {
                if (params.get('add') === 'building') {
                    this.newBuilding();
                } else if (params.get('add') === 'level') {
                    this.newLevel();
                }
            }
        }))
    }
}
