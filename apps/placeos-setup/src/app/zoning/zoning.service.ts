import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { randomInt } from "@placeos-tools/common";
import { openConfirmModal } from "libs/components/src/lib/confirm-modal.component";
import { BehaviorSubject } from "rxjs";
import { ZoneModalComponent } from "./zone-modal.component";

export interface Zone {
    id: string;
    building_id: string;
    level_id: string;
    name: string;
    capacity: number;
    whitelist_groups: string[],
    people_counting: boolean,
    counting_method: string,
    people_finding: boolean,
    finding_method: string,
    locatable_firewarden: boolean,
    locatable_firstaiders: boolean,
    locatable_marshall: boolean,
}

@Injectable({
    providedIn: 'root'
})
export class ZonesService {
    private _zone_list = new BehaviorSubject<Zone[]>([{
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
    }]);
    private _selected = new BehaviorSubject<string[]>([]);

    public readonly zones = this._zone_list.asObservable();
    public readonly selected = this._selected.asObservable();

    constructor(private _dialog: MatDialog) {
        this._load();
    }

    public isSelected(id: string) {
        const list = this._selected.getValue();
        return !!list.find(_ => id === _);
    }

    public setSelected(id: string, state: boolean) {
        const list = this._selected.getValue().filter(_ => _ !== id);
        if (id === '*') {
            this._selected.next(!state ? [] : this._zone_list.getValue().map(_ => _.id));
            return;
        }
        if (!state) this._selected.next(list);
        else this._selected.next([...list, id]);
    }

    public setZone(zone: Zone) {
        if (!zone.id) zone.id = `zone-${randomInt(9999_9999, 1000_0000)}`;
        this._zone_list.next([...this._zone_list.getValue().filter(_ => _.id !== zone.id), zone]);
        this._store();
    }

    public async removeZone(zone: Zone) {
        const { close, reason } = await openConfirmModal({
            title: 'Remove Zone',
            content: `Are you sure you want to remove zone "${zone.name}"?`,
            icon: { content: 'delete' }
        }, this._dialog);
        if (reason !== 'done') return;
        this._zone_list.next(this._zone_list.getValue().filter(_ => _.id !== zone.id));
        this._store();
        close();
    }

    public openZoneModal(zone?: Zone) {
        const ref = this._dialog.open(ZoneModalComponent, {
            data: zone
        });
        ref.componentInstance.onSave.subscribe((zone) => {
            this.setZone(zone as any);
            ref.close();
        });
    }

    private _load() {
        const data = JSON.parse(localStorage.getItem('PLACEOS_BUILD.Zones') || '[]');
        this._zone_list.next(data);
    }

    private _store() {
        localStorage.setItem('PLACEOS_BUILD.Zones', JSON.stringify(this._zone_list.getValue()));
    }
}