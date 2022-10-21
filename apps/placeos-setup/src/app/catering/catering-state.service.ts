import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseClass, unique } from '@placeos-tools/common';
import { randomInt } from '@placeos-tools/common';
import { openConfirmModal } from 'libs/components/src/lib/confirm-modal.component';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { OrganisationService } from '../organisation/organisation.service';
import { openCateringItemModal } from './catering-item-modal.component';

import { CateringItem } from './catering-item.class';
import { openCateringItemOptionModal } from './catering-option-modal.component';
import { CateringOption } from './catering.interfaces';

export interface CateringMenuConfig {
    id: string;
    building_id: string;
}

@Injectable({
    providedIn: 'root',
})
export class CateringStateService extends BaseClass {
    private _menu_list = new BehaviorSubject<CateringMenuConfig[]>([]);
    private _menu_map = new BehaviorSubject<Record<string, CateringItem[]>>({});
    private _loading = new BehaviorSubject<boolean>(false);
    private _currency = new BehaviorSubject<string>('USD');
    private _active_id = new BehaviorSubject<string>('');
    /** Observable for whether the menu for the active building is loadingg */
    public readonly loading = this._loading.asObservable();
    /** Observable for the currency code of the active building */
    public readonly currency = this._currency.asObservable();
    /** Observable for the id of active menu */
    public readonly active_id = this._active_id.asObservable();

    /** List of available menus */
    public readonly menu_list = this._menu_list.asObservable();
    /** Menu for the active ID */
    public readonly menu = combineLatest([
        this._active_id,
        this._menu_map,
    ]).pipe(map(([id, menu_map]) => menu_map[id] || []));
    /** List of existing categories for the menu */
    public readonly categories = this.menu.pipe(
        map((menu) => unique(menu.map((i) => i.category)))
    );

    constructor(private _dialog: MatDialog, private _org: OrganisationService) {
        super();
    }

    public async initMenuList() {
        this._load();
        const buildings = await this._org.buildings.pipe(take(1)).toPromise();
        for (const bld of buildings) {
            if (
                !this._menu_list
                    .getValue()
                    .find(({ building_id }) => building_id === bld.id)
            ) {
                this._menu_list.next([
                    ...this._menu_list.getValue(),
                    {
                        id: `menu-${randomInt(9999_9999, 1000_0000)}`,
                        building_id: bld.id,
                    },
                ]);
            }
        }
    }

    public async addItem(item: CateringItem = new CateringItem()) {
        const categories = await this.categories.pipe(take(1)).toPromise();
        const { reason, close, metadata } = await openCateringItemModal(
            {
                item,
                categories,
            },
            this._dialog
        );
        if (reason !== 'done') return;
        const menu = await this.menu.pipe(take(1)).toPromise();
        const index = menu.findIndex((itm) => itm.id === item.id);
        if (index >= 0) menu.splice(index, 1, metadata.item);
        else menu.push(metadata.item);
        this._updateMenu(menu);
        close();
    }

    public async addOption(
        item: CateringItem,
        option: CateringOption = {} as any
    ) {
        const types = unique(item.options.map((i) => i.group));
        const { reason, close, metadata } = await openCateringItemOptionModal(
            {
                parent: item,
                option,
                types,
            },
            this._dialog
        );
        if (reason !== 'done') return;
        const menu = await this.menu.pipe(take(1)).toPromise();
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
            this._dialog
        );
        if (reason !== 'done') return;
        loading('Removing catering item...');
        let menu = await this.menu.pipe(take(1)).toPromise();
        menu = menu.filter((itm) => item.id !== itm.id);
        this._updateMenu(menu);
        close()
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
            this._dialog
        );
        if (reason !== 'done') return;
        loading('Removing catering item option...');
        const menu = await this.menu.pipe(take(1)).toPromise();
        menu.splice(
            menu.findIndex((itm) => itm.id === item.id),
            1,
            new CateringItem({
                ...item,
                options: item.options.filter((opt) => opt.id !== option.id),
            })
        );
        this._updateMenu(menu);
        close();
    }


    private _updateMenu(menu: CateringItem[]) {

        this._store();
    }

    private _load() {
        let data = JSON.parse(
            localStorage.getItem('PLACEOS_BUILD.MenuList') || '[]'
        );
        this._menu_list.next(data);
        data = JSON.parse(
            localStorage.getItem('PLACEOS_BUILD.MenuMap') || '{}'
        );
        this._menu_map.next(data);
    }

    private _store() {
        localStorage.setItem(
            'PLACEOS_BUILD.MenuList',
            JSON.stringify(this._menu_list.getValue())
        );
        localStorage.setItem(
            'PLACEOS_BUILD.MenuMap',
            JSON.stringify(this._menu_map.getValue())
        );
    }
}
