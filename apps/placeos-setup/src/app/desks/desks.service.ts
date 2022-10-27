import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { randomInt } from "@placeos-tools/common";
import { openConfirmModal } from "libs/components/src/lib/confirm-modal.component";
import { BehaviorSubject } from "rxjs";
import { DeskModalComponent } from "./desk-modal.component";

export interface Desk {
    id: string;
    map_id: string;
    building_id: string;
    level_id: string;
    display_name: string;
    name: string;
    zone: string;
    features: string[];
    whitelist_groups: string[];
    bookable: boolean;
    requires_approval: boolean,
    auto_release: boolean,
    auto_release_delay: number;
    sensor_brand: string;
    recurrence: true,
    max_recurrence: number;
}

@Injectable({
    providedIn: 'root'
})
export class DesksService {
    private _desk_list = new BehaviorSubject<Desk[]>([{
        id: 'test',
        map_id: 'desk-01',
        building_id: 'bld-01',
        level_id: 'lvl-01',
        display_name: 'Desk 1-01',
        name: 'Desk',
        zone: '',
        features: [],
        whitelist_groups: [],
        bookable: true,
        requires_approval: true,
        auto_release: true,
        auto_release_delay: 10,
        sensor_brand: 'Kontakt IO',
        recurrence: true,
        max_recurrence: 2
    }]);

    private _selected = new BehaviorSubject<string[]>([]);

    public readonly desks = this._desk_list.asObservable();
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
            this._selected.next(!state ? [] : this._desk_list.getValue().map(_ => _.id));
            return;
        }
        if (!state) this._selected.next(list);
        else this._selected.next([...list, id]);
    }

    public setDesk(desk: Desk) {
        if (!desk.id) desk.id = `desk-${randomInt(9999_9999, 1000_0000)}`;
        this._desk_list.next([...this._desk_list.getValue().filter(_ => _.id !== desk.id), desk]);
        this._store();
    }

    public async removeDesk(desk: Desk) {
        const { close, reason } = await openConfirmModal({
            title: 'Remove Desk',
            content: `Are you sure you want to remove desk "${desk.display_name || desk.name}"?`,
            icon: { content: 'delete' }
        }, this._dialog);
        if (reason !== 'done') return;
        this._desk_list.next(this._desk_list.getValue().filter(_ => _.id !== desk.id));
        this._store();
        close();
    }

    public openDeskModal(desk?: Desk) {
        const ref = this._dialog.open(DeskModalComponent, {
            data: desk
        });
        ref.componentInstance.onSave.subscribe((desk) => {
            this.setDesk(desk as any);
            ref.close();
        });
    }

    private _load() {
        const data = JSON.parse(localStorage.getItem('PLACEOS_BUILD.Desks') || '[]');
        this._desk_list.next(data);
    }

    private _store() {
        localStorage.setItem('PLACEOS_BUILD.Desks', JSON.stringify(this._desk_list.getValue()));
    }
}