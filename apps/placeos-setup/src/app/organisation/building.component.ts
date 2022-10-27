import { Component, Input, SimpleChanges } from '@angular/core';
import { ANIMATION_SHOW_CONTRACT_EXPAND } from '@placeos-tools/common';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Building, OrganisationService } from './organisation.service';

@Component({
    selector: `org-building,[org-building]`,
    template: `
        <div
            details
            class="flex items-center border-b border-neutral-500 text-sm hover:bg-black/10 relative"
        >
            <div thead class="min-w-0">
                <mat-checkbox [ngModel]="selected" (ngModelChange)="setSelected($event)"></mat-checkbox>
            </div>
            <div class="min-w-0 flex items-center w-10 p-0 justify-end">
                <button
                    mat-icon-button
                    (click)="show = !show"
                    [disabled]="!(levels | async)?.length"
                >
                    <app-icon>{{
                        show ? 'expand_less' : 'expand_more'
                    }}</app-icon>
                </button>
            </div>
            <div class="w-56">{{ building.display_name }}</div>
            <div>{{ building.country }}</div>
            <div class="w-32">{{ building.city }}</div>
            <div class="w-56">{{ building.address }}</div>
            <div>{{ (levels | async)?.length || 0 }}</div>
            <div>{{ building.currency }}</div>
            <div>{{ building.allow_visitors ? 'YES' : 'NO' }}</div>
            <div>{{ building.catering_available ? 'YES' : 'NO' }}</div>
            <div
                actions
                class="absolute top-1/2 -translate-y-1/2 left-24 rounded-3xl flex items-center bg-white dark:bg-neutral-700 shadow !p-0 min-w-0"
            >
                <button mat-icon-button matTooltip="Edit Building" (click)="edit()">
                    <app-icon>edit</app-icon>
                </button>
                <button mat-icon-button matTooltip="Delete Building" (click)="remove()">
                    <app-icon>delete</app-icon>
                </button>
            </div>
        </div>
        <ul
            *ngIf="(levels | async)?.length"
            class="list-none p-0 m-0 w-full relative z-0"
            [class.shown]="show"
            [@show]="show ? 'show' : 'hide'"
        >
            <li
                org-level
                class="flex items-center w-full"
                *ngFor="let item of levels | async; let i = index"
                [level]="item"
            ></li>
        </ul>
    `,
    styles: [
        `
            :host {
                min-width: 100%;
            }

            [details] > div {
                min-width: 6rem;
                padding: 1rem;
                flex-shrink: 0;
            }

            [actions] {
                opacity: 0;
                transition: opacity 200ms;
                pointer-events: none;
            }

            [details]:hover [actions] {
                opacity: 1;
                pointer-events: auto;
            }
        `,
    ],
    animations: [ANIMATION_SHOW_CONTRACT_EXPAND],
})
export class BuildingComponent {
    @Input() public building: Building;

    private _bld_id = new BehaviorSubject('');

    public show = false;

    public readonly levels = combineLatest([
        this._bld_id,
        this._org.levels,
    ]).pipe(map(([id, l]) => l.filter((lvl) => lvl.parent_id === id)));

    public readonly edit = () => this._org.openBuildingModal(this.building);
    public readonly remove = () => this._org.removeBuilding(this.building);
    public readonly setSelected = (s) => this._org.setSelected(this.building.id, s);

    public get selected() {
        return this._org.isSelected(this.building.id);
    }

    constructor(private _org: OrganisationService) {}

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.building) {
            this._bld_id.next(this.building?.id || '');
        }
    }
}
