import { computed, inject, Injectable, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseClass, unique } from '@placeos-tools/common';
import { openConfirmModal } from 'libs/components/src/lib/confirm-modal.component';
import { OrganisationService } from '../organisation/organisation.service';
import { openCateringItemModal } from './catering-item-modal.component';

import { CateringItem } from './catering-item.class';
import { CateringMenuModalComponent } from './catering-menu-modal.component';
import { openCateringItemOptionModal } from './catering-option-modal.component';
import { CateringOption } from './catering.interfaces';

export interface CateringMenuConfig {
    id: string;
    building_id: string;
    name: string;
}

@Injectable({
    providedIn: 'root',
})
export class CateringStateService extends BaseClass {
    private _dialog = inject(MatDialog);
    private _org = inject(OrganisationService);

    private _menu_map = signal<Record<string, CateringItem[]>>({});
    private _loading = signal<boolean>(false);
    private _currency = signal<string>('USD');
    private _active_id = signal<string>('');
    /** Signal for whether the menu for the active building is loadingg */
    public readonly loading = this._loading.asReadonly();
    /** Signal for the currency code of the active building */
    public readonly currency = this._currency.asReadonly();
    /** Signal for the id of active menu */
    public readonly active_id = this._active_id.asReadonly();

    /** List of available menus */
    public readonly menu_list = computed(() =>
        this._org
            .buildings()
            .filter((bld) => bld.catering_available)
            .map((bld) => ({
                id: `menu-${bld.id}`,
                building_id: bld.id,
                name: bld.display_name || bld.name,
            })),
    );
    /** Menu for the active ID */
    public readonly menu = computed(
        () => this._menu_map()[this._active_id()] || [],
    );
    /** List of existing categories for the menu */
    public readonly categories = computed(() =>
        unique(this.menu().map((i) => i.category)),
    );

    public menuForID(id: string) {
        const menus = this._menu_map() || {};
        return menus[id] || [];
    }

    constructor() {
        super();
        this._load();
    }

    public openMenuModal(item: CateringMenuConfig) {
        this._active_id.set(item.id);
        const ref = this._dialog.open(CateringMenuModalComponent, {
            data: item,
        });
        const add_subscription = ref.componentInstance.add.subscribe(() =>
            this.addItem(),
        );
        this.subscription('add-item', () => add_subscription.unsubscribe());
        ref.afterClosed().subscribe(() => this._active_id.set(''));
    }

    public async removeMenu(item: CateringMenuConfig) {
        const { close, reason } = await openConfirmModal(
            {
                title: 'Clear Menu',
                content: `Are you sure you want to remove all the menu items for "${item.name}"?`,
                icon: { content: 'delete_sweep' },
            },
            this._dialog,
        );
        if (reason !== 'done') return;
        const menu = { ...this._menu_map() };
        delete menu[item.id];
        this._menu_map.set(menu);
        this._store();
        close();
    }

    public async addItem(item: CateringItem = new CateringItem()) {
        const categories = this.categories();
        const { reason, close, metadata } = await openCateringItemModal(
            {
                item,
                categories,
            },
            this._dialog,
        );
        if (reason !== 'done') return;
        console.log('Item:', metadata);
        const menu = [...this.menu()];
        const index = menu.findIndex((itm) => itm.id === item.id);
        if (index >= 0) menu.splice(index, 1, metadata.item);
        else menu.push(metadata.item);
        console.log('Menu:', menu);
        this._updateMenu(menu);
        close();
    }

    public async addOption(
        item: CateringItem,
        option: CateringOption = {} as any,
    ) {
        const types = unique(item.options.map((i) => i.group));
        const { reason, close, metadata } = await openCateringItemOptionModal(
            {
                parent: item,
                option,
                types,
            },
            this._dialog,
        );
        if (reason !== 'done') return;
        const menu = [...this.menu()];
        const index = menu.findIndex((itm) => itm.id === item.id);
        if (index >= 0) menu.splice(index, 1, metadata.item);
        else menu.push(metadata.item);
        this._updateMenu(menu);
        close();
    }

    public async deleteItem(item: CateringItem) {
        const { reason, loading, close } = await openConfirmModal(
            {
                title: 'Delete Catering Item',
                content: `Are you sure you wish to remove the catering item ${item.name} from the menu?`,
                icon: {
                    type: 'icon',
                    class: 'material-icons',
                    content: 'delete',
                },
            },
            this._dialog,
        );
        if (reason !== 'done') return;
        loading('Removing catering item...');
        let menu = this.menu();
        menu = menu.filter((itm) => item.id !== itm.id);
        this._updateMenu(menu);
        close();
    }

    public async deleteOption(item: CateringItem, option: CateringOption) {
        const { reason, loading, close } = await openConfirmModal(
            {
                title: 'Delete Catering Item Option',
                content: `Are you sure you wish to remove the catering option "${option.name}" from "${item.name}"?`,
                icon: {
                    type: 'icon',
                    class: 'material-icons',
                    content: 'delete',
                },
            },
            this._dialog,
        );
        if (reason !== 'done') return;
        loading('Removing catering item option...');
        const menu = [...this.menu()];
        menu.splice(
            menu.findIndex((itm) => itm.id === item.id),
            1,
            new CateringItem({
                ...item,
                options: item.options.filter((opt) => opt.id !== option.id),
            }),
        );
        this._updateMenu(menu);
        close();
    }

    private _updateMenu(menu: CateringItem[]) {
        const old_menu = this._menu_map();
        const new_menu = { ...old_menu };
        new_menu[this._active_id()] = menu;
        this._menu_map.set(new_menu);
        this._store();
    }

    private _load() {
        const data = JSON.parse(
            localStorage.getItem('PLACEOS_BUILD.MenuMap') || '{}',
        );
        this._menu_map.set(data);
    }

    private _store() {
        localStorage.setItem(
            'PLACEOS_BUILD.MenuMap',
            JSON.stringify(this._menu_map()),
        );
    }
}
