import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { randomInt } from '@placeos-tools/common';
import { openConfirmModal } from 'libs/components/src/lib/confirm-modal.component';
import { BehaviorSubject } from 'rxjs';
import { MonitoringItemModalComponent } from './item-modal.component';

export interface BuildingMonitoring {
    id: string;
    level_id: string;
    required: boolean;
    sensor_brand: string;
    sensor_locations_available: boolean;
    show_on_map: boolean;
    show_in_analytics: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class MonitoringService {
    private _dialog = inject(MatDialog);

    private _list = new BehaviorSubject<BuildingMonitoring[]>([
        {
            id: 'bld-01',
            level_id: 'lvl-01',
            required: true,
            sensor_locations_available: true,
            sensor_brand: 'Kontakt IO',
            show_on_map: true,
            show_in_analytics: false,
        },
    ]);
    private _selected = new BehaviorSubject<string[]>([]);

    public readonly item_list = this._list.asObservable();
    public readonly selected = this._selected.asObservable();

    constructor() {
        this._load();
    }

    public isSelected(id: string) {
        const list = this._selected.getValue();
        return !!list.find((_) => id === _);
    }

    public setSelected(id: string, state: boolean) {
        const list = this._selected.getValue().filter((_) => _ !== id);
        if (id === '*') {
            this._selected.next(
                !state ? [] : this._list.getValue().map((_) => _.id)
            );
            return;
        }
        if (!state) this._selected.next(list);
        else this._selected.next([...list, id]);
    }

    public setItem(item: BuildingMonitoring) {
        if (!item.id) item.id = `reg-${randomInt(9999_9999, 1000_0000)}`;
        this._list.next([
            ...this._list.getValue().filter((_) => _.id !== item.id),
            item,
        ]);
        this._store();
    }

    public async removeItem(item: BuildingMonitoring) {
        const { close, reason } = await openConfirmModal(
            {
                title: 'Remove region',
                content: `Are you sure you want to remove region "${item.id}"?`,
                icon: { content: 'delete' },
            },
            this._dialog
        );
        if (reason !== 'done') return;
        this._list.next(this._list.getValue().filter((_) => _.id !== item.id));
        this._store();
        close();
    }

    public async removeSelected() {
        const list = this._selected.getValue();
        if (!list.length) return;
        if (list.length === 1) {
            return this.removeItem(
                this._list.getValue().find((_) => _.id === list[0])
            );
        }
        const { close, reason } = await openConfirmModal(
            {
                title: 'Remove regions',
                content: `Are you sure you want to remove ${list.length} regions?`,
                icon: { content: 'delete' },
            },
            this._dialog
        );
        if (reason !== 'done') return;
        this._list.next(
            this._list.getValue().filter((_) => !list.find((id) => _.id === id))
        );
        this._selected.next([]);
        this._store();
        close();
    }

    public openItemModal(item?: BuildingMonitoring) {
        const ref = this._dialog.open(MonitoringItemModalComponent, {
            data: item,
        });
        ref.componentInstance.onSave.subscribe((locker) => {
            this.setItem(locker as any);
            ref.close();
        });
    }

    private _load() {
        const data = JSON.parse(
            localStorage.getItem('PLACEOS_BUILD.Monitoring') || '[]'
        );
        this._list.next(data);
    }

    private _store() {
        localStorage.setItem(
            'PLACEOS_BUILD.Monitoring',
            JSON.stringify(this._list.getValue())
        );
    }
}
