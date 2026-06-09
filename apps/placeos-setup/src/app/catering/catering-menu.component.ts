import { Component } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { CateringStateService } from './catering-state.service';

@Component({
    standalone: false,
    selector: 'catering-menu',
    template: `
        <mat-tab-group class="h-full">
          <mat-tab label="All Items">
            @if ((menu | async)?.length) {
              @for (item of menu | async; track item) {
                <div catering-menu-item [item]="item"></div>
              }
            } @else {
              <div class="flex flex-col items-center p-8 space-y-2">
                <app-icon>close</app-icon>
                <p>No items in menu</p>
              </div>
            }
          </mat-tab>
          @for (group of categories | async; track group) {
            <mat-tab [label]="group">
              @for (item of (tab_menu | async)[group]; track item) {
                <div catering-menu-item [item]="item"></div>
              }
            </mat-tab>
          }
        </mat-tab-group>
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
