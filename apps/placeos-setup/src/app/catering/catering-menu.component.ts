import { Component, computed, inject, signal } from '@angular/core';

import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { IconComponent } from '../../../../../libs/components/src/lib/icon.component';
import { CateringMenuItemComponent } from './catering-menu-item.component';
import { CateringStateService } from './catering-state.service';

@Component({
    selector: 'catering-menu',
    template: `
        <mat-tab-group class="h-full">
            <mat-tab label="All Items">
                @if (menu()?.length) {
                    @for (item of menu(); track item) {
                        <div catering-menu-item [item]="item"></div>
                    }
                } @else {
                    <div class="flex flex-col items-center space-y-2 p-8">
                        <app-icon>close</app-icon>
                        <p>No items in menu</p>
                    </div>
                }
            </mat-tab>
            @for (group of categories(); track group) {
                <mat-tab [label]="group">
                    @for (item of tab_menu()[group]; track item) {
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
    imports: [MatTabGroup, MatTab, CateringMenuItemComponent, IconComponent],
})
export class CateringMenuComponent {
    private _catering = inject(CateringStateService);

    /** Signal for the currently active menu */
    public readonly menu = this._catering.menu;

    public readonly categories = this._catering.categories;
    /** Store for the currently selected tab */
    public readonly shown_tab = signal<string>('');
    /** Signal for the menu list for the selected tab */
    public readonly tab_menu = computed(() => {
        const menu_map = {};
        for (const group of this.categories()) {
            menu_map[group] = this.menu().filter(
                (item) => item.category === group,
            );
        }
        return menu_map;
    });
}
