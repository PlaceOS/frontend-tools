import { Injectable, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { randomInt } from '@placeos-tools/common';
import { openConfirmModal } from 'libs/components/src/lib/confirm-modal.component';

import { CarSpaceModalComponent } from './car-space-modal.component';

export interface CarSpace {
    id: string;
    map_id: string;
    building_id: string;
    level_id: string;
    display_name: string;
    name: string;
    type: string;
    features: string[];
    whitelist_groups: string[];
    bookable: boolean;
    plate_recognition: boolean;
    auto_release: boolean;
    auto_release_delay: number;
    sensor_brand: string;
    recurrence: true;
    max_recurrence: number;
}

@Injectable({
    providedIn: 'root',
})
export class CarSpacesService {
    private _dialog = inject(MatDialog);

    private _space_list = signal<CarSpace[]>([
        {
            id: 'test',
            map_id: 'carspace-01',
            building_id: 'bld-01',
            level_id: 'lvl-01',
            display_name: 'Car Space 1-01',
            name: 'Car Space',
            type: 'Car',
            features: [],
            whitelist_groups: [],
            bookable: true,
            plate_recognition: true,
            auto_release: true,
            auto_release_delay: 10,
            sensor_brand: 'Kontakt IO',
            recurrence: true,
            max_recurrence: 2,
        },
    ]);
    private _selected = signal<string[]>([]);

    public readonly spaces = this._space_list.asReadonly();
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
                !state ? [] : this._space_list().map((_) => _.id),
            );
            return;
        }
        if (!state) this._selected.set(list);
        else this._selected.set([...list, id]);
    }

    public setCarSpace(carspace: CarSpace) {
        if (!carspace.id)
            carspace.id = `carspace-${randomInt(9999_9999, 1000_0000)}`;
        this._space_list.set([
            ...this._space_list().filter((_) => _.id !== carspace.id),
            carspace,
        ]);
        this._store();
    }

    public async removeCarSpace(carspace: CarSpace) {
        const { close, reason } = await openConfirmModal(
            {
                title: 'Remove Car Space',
                content: `Are you sure you want to remove car space "${
                    carspace.display_name || carspace.name
                }"?`,
                icon: { content: 'delete' },
            },
            this._dialog,
        );
        if (reason !== 'done') return;
        this._space_list.set(
            this._space_list().filter((_) => _.id !== carspace.id),
        );
        this._store();
        close();
    }

    public async removeSelected() {
        const list = this._selected();
        if (!list.length) return;
        if (list.length === 1) {
            return this.removeCarSpace(
                this._space_list().find((_) => _.id === list[0]),
            );
        }
        const { close, reason } = await openConfirmModal(
            {
                title: 'Remove regions',
                content: `Are you sure you want to remove ${list.length} regions?`,
                icon: { content: 'delete' },
            },
            this._dialog,
        );
        if (reason !== 'done') return;
        this._space_list.set(
            this._space_list().filter((_) => !list.find((id) => _.id === id)),
        );
        this._selected.set([]);
        this._store();
        close();
    }

    public openCarSpaceModal(carspace?: CarSpace) {
        const ref = this._dialog.open(CarSpaceModalComponent, {
            data: carspace,
        });
        ref.componentInstance.onSave.subscribe((carspace) => {
            this.setCarSpace(carspace as any);
            ref.close();
        });
    }

    private _load() {
        const data = JSON.parse(
            localStorage.getItem('PLACEOS_BUILD.CarSpaces') || '[]',
        );
        this._space_list.set(data);
    }

    private _store() {
        localStorage.setItem(
            'PLACEOS_BUILD.CarSpaces',
            JSON.stringify(this._space_list()),
        );
    }
}
