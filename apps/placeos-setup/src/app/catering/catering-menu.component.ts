import { Component } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { CateringStateService } from './catering-state.service';

@Component({
    selector: 'catering-menu',
    template: `
        <mat-tab-group class="h-full">
            <mat-tab label="All Items">
                <ng-container *ngIf="(menu | async)?.length; else empty_state">
                    <ng-container *ngFor="let item of menu | async">
                        <div catering-menu-item [item]="item"></div>
                    </ng-container>
                </ng-container>
            </mat-tab>
            <mat-tab *ngFor="let group of categories | async" [label]="group">
                <ng-container *ngFor="let item of (tab_menu | async)[group]">
                    <div catering-menu-item [item]="item"></div>
                </ng-container>
            </mat-tab>
        </mat-tab-group>
        <ng-template #empty_state>
            <div class="flex flex-col items-center p-8 space-y-2">
                <app-icon>close</app-icon>
                <p>No items in menu</p>
            </div>
        </ng-template>
    `,
    styles: [
        `
            :host {
                display: flex;
                flex-direction: column;
                height: 90%;
                width: 100%;
            }
        `,
    ],
})
export class CateringMenuComponent {
    /** Observable for the currently active menu */
    public readonly menu = this._catering.menu;

    public readonly categories = this._catering.categories;
    /** Store for the currently selected tab */
    public readonly shown_tab = new BehaviorSubject<string>('');
    /** Observable for the menu list for the selected tab */
    public readonly tab_menu = combineLatest([
        this.menu,
        this._catering.categories,
    ]).pipe(
        map(([menu, categories]) => {
            const menu_map = {};
            for (const group of categories) {
                menu_map[group] = menu.filter(
                    (item) => item.category === group
                );
            }
            console.log('Menu:', menu, categories, menu_map);
            return menu_map;
        })
    );

    constructor(private _catering: CateringStateService) {}
}
