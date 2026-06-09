import { Injectable, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { randomInt } from '@placeos-tools/common';
import { openConfirmModal } from 'libs/components/src/lib/confirm-modal.component';

import { ZoneModalComponent } from './zone-modal.component';

export interface Zone {
    id: string;
    building_id: string;
    level_id: string;
    name: string;
    capacity: number;
    whitelist_groups: string[];
    people_counting: boolean;
    counting_method: string;
    people_finding: boolean;
    finding_method: string;
    locatable_firewarden: boolean;
    locatable_firstaiders: boolean;
    locatable_marshall: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class ZonesService {
    private _dialog = inject(MatDialog);

    private _zone_list = signal<Zone[]>([
        {
            id: 'test',
            building_id: 'bld-01',
            level_id: 'lvl-01',
            name: 'Zone',
            capacity: 30,
            whitelist_groups: [],
            people_counting: true,
            counting_method: 'Sensors',
            people_finding: true,
            finding_method: 'Sensors',
            locatable_firewarden: true,
            locatable_firstaiders: true,
            locatable_marshall: true,
        },
    ]);
    private _selected = signal<string[]>([]);

    public readonly zones = this._zone_list.asReadonly();
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
                !state ? [] : this._zone_list().map((_) => _.id),
            );
            return;
        }
        if (!state) this._selected.set(list);
        else this._selected.set([...list, id]);
    }

    public setZone(zone: Zone) {
        if (!zone.id) zone.id = `zone-${randomInt(9999_9999, 1000_0000)}`;
        this._zone_list.set([
            ...this._zone_list().filter((_) => _.id !== zone.id),
            zone,
        ]);
        this._store();
    }

    public async removeZone(zone: Zone) {
        if (!zone) return;
        const { close, reason } = await openConfirmModal(
            {
                title: 'Remove Zone',
                content: `Are you sure you want to remove zone "${zone.name}"?`,
                icon: { content: 'delete' },
            },
            this._dialog,
        );
        if (reason !== 'done') return;
        this._zone_list.set(this._zone_list().filter((_) => _.id !== zone.id));
        this._store();
        close();
    }

    public async removeSelected() {
        const list = this._selected();
        if (!list.length) return;
        if (list.length === 1) {
            return this.removeZone(
                this._zone_list().find((_) => _.id === list[0]),
            );
        }
        const { close, reason } = await openConfirmModal(
            {
                title: 'Remove Zones',
                content: `Are you sure you want to remove ${list.length} zones?`,
                icon: { content: 'delete' },
            },
            this._dialog,
        );
        if (reason !== 'done') return;
        this._zone_list.set(
            this._zone_list().filter((_) => !list.find((id) => _.id === id)),
        );
        this._selected.set([]);
        this._store();
        close();
    }

    public openZoneModal(zone?: Zone) {
        const ref = this._dialog.open(ZoneModalComponent, {
            data: zone,
        });
        ref.componentInstance.onSave.subscribe((zone) => {
            this.setZone(zone as any);
            ref.close();
        });
    }

    private _load() {
        const data = JSON.parse(
            localStorage.getItem('PLACEOS_BUILD.Zones') || '[]',
        );
        this._zone_list.set(data);
    }

    private _store() {
        localStorage.setItem(
            'PLACEOS_BUILD.Zones',
            JSON.stringify(this._zone_list()),
        );
    }
}
