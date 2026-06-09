import { Injectable, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { randomInt } from '@placeos-tools/common';
import { openConfirmModal } from 'libs/components/src/lib/confirm-modal.component';

import { OrganisationBuildingModalComponent } from './building-modal.component';
import { OrganisationLevelModalComponent } from './level-modal.component';

export interface Building {
    id: string;
    display_name: string;
    name: string;
    country: string;
    city: string;
    address: string;
    currency: string;
    allow_visitors: boolean;
    catering_available: boolean;
}

export interface BuildingLevel {
    id: string;
    parent_id: string;
    display_name: string;
    name: string;
    allow_visitors?: boolean;
    catering_available?: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class OrganisationService {
    private _dialog = inject(MatDialog);

    private _building_list = signal<Building[]>([
        {
            id: 'bld-01',
            display_name: 'Building 1',
            name: 'BLD 01',
            country: 'Austrialia',
            city: 'Sydney',
            address: '1 Happy Place',
            currency: 'AUD',
            allow_visitors: true,
            catering_available: true,
        },
    ]);
    private _floor_list = signal<BuildingLevel[]>([
        {
            id: 'lvl-01',
            parent_id: 'bld-01',
            display_name: 'Level 1',
            name: 'LVL 01',
            allow_visitors: true,
            catering_available: true,
        },
    ]);
    private _selected = signal<string[]>([]);

    public readonly buildings = this._building_list.asReadonly();
    public readonly levels = this._floor_list.asReadonly();
    public readonly selected = this._selected.asReadonly();

    constructor() {
        this._load();
    }

    public isSelected(id: string) {
        const list = this._selected();
        return !!list.find((_) => id === _);
    }

    public setSelected(id: string, state: boolean) {
        const list = this._selected().filter((_) => _ !== id);
        if (id === '*') {
            this._selected.set(
                !state
                    ? []
                    : [
                          ...this._building_list().map((_) => _.id),
                          ...this._floor_list().map((_) => _.id),
                      ],
            );
            return;
        }
        if (!state) this._selected.set(list);
        else this._selected.set([...list, id]);
    }

    public setBuilding(bld: Building) {
        if (!bld.id) bld.id = `bld-${randomInt(9999_9999, 1000_0000)}`;
        this._building_list.set([
            ...this._building_list().filter((_) => _.id !== bld.id),
            bld,
        ]);
        this._store();
    }

    public setLevel(lvl: BuildingLevel) {
        if (!lvl.id) lvl.id = `lvl-${randomInt(9999_9999, 1000_0000)}`;
        this._floor_list.set([
            ...this._floor_list().filter((_) => _.id !== lvl.id),
            lvl,
        ]);
        this._store();
    }

    public async removeBuilding(bld: Building) {
        const { close, reason } = await openConfirmModal(
            {
                title: 'Remove Building',
                content: `Are you sure you want to remove building "${
                    bld.display_name || bld.name
                }"?`,
                icon: { content: 'delete' },
            },
            this._dialog,
        );
        if (reason !== 'done') return;
        this._building_list.set(
            this._building_list().filter((_) => _.id !== bld.id),
        );
        this._store();
        close();
    }

    public async removeLevel(lvl: BuildingLevel) {
        const { close, reason } = await openConfirmModal(
            {
                title: 'Remove Building',
                content: `Are you sure you want to remove building "${
                    lvl.display_name || lvl.name
                }"?`,
                icon: { content: 'delete' },
            },
            this._dialog,
        );
        if (reason !== 'done') return;
        this._floor_list.set(this._floor_list().filter((_) => _.id !== lvl.id));
        this._store();
        close();
    }

    public openBuildingModal(bld?: Building) {
        const ref = this._dialog.open(OrganisationBuildingModalComponent, {
            data: bld,
        });
        ref.componentInstance.onSave.subscribe((bld) => {
            this.setBuilding(bld as any);
            ref.close();
        });
    }

    public openLevelModal(lvl?: BuildingLevel) {
        const ref = this._dialog.open(OrganisationLevelModalComponent, {
            data: { lvl, bld_list: this._building_list() },
        });
        ref.componentInstance.onSave.subscribe((lvl) => {
            this.setLevel(lvl as any);
            ref.close();
        });
    }

    private _load() {
        const bld_data = JSON.parse(
            localStorage.getItem('PLACEOS_BUILD.Buildings') || '[]',
        );
        this._building_list.set(bld_data);
        const lvl_data = JSON.parse(
            localStorage.getItem('PLACEOS_BUILD.Levels') || '[]',
        );
        this._floor_list.set(lvl_data);
    }

    private _store() {
        localStorage.setItem(
            'PLACEOS_BUILD.Buildings',
            JSON.stringify(this._building_list()),
        );
        localStorage.setItem(
            'PLACEOS_BUILD.Levels',
            JSON.stringify(this._floor_list()),
        );
    }
}
