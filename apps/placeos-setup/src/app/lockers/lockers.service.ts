import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { randomInt } from "@placeos-tools/common";
import { openConfirmModal } from "libs/components/src/lib/confirm-modal.component";
import { BehaviorSubject } from "rxjs";
import { LockerModalComponent } from "./locker-modal.component";

export interface Locker {
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
export class LockersService {
    private _locker_list = new BehaviorSubject<Locker[]>([{
        id: 'test',
        map_id: 'locker-01',
        building_id: 'bld-01',
        level_id: 'lvl-01',
        display_name: 'Locker 1-01',
        name: 'Locker',
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

    public readonly lockers = this._locker_list.asObservable();

    constructor(private _dialog: MatDialog) {}

    public setLocker(item: Locker) {
        if (!item.id) item.id = `locker-${randomInt(9999_9999, 1000_0000)}`;
        this._locker_list.next([...this._locker_list.getValue().filter(_ => _.id !== item.id), item]);
        this._store();
    }

    public async removeLocker(item: Locker) {
        const { close, reason } = await openConfirmModal({
            title: 'Remove Locker',
            content: `Are you sure you want to remove locker "${item.display_name || item.name}"?`,
            icon: { content: 'delete' }
        }, this._dialog);
        if (reason !== 'done') return;
        this._locker_list.next(this._locker_list.getValue().filter(_ => _.id !== item.id));
        this._store();
        close();
    }

    public openLockerModal(item?: Locker) {
        const ref = this._dialog.open(LockerModalComponent, {
            data: item
        });
        ref.componentInstance.onSave.subscribe((locker) => {
            this.setLocker(locker as any);
            ref.close();
        });
    }

    private _load() {
        const data = JSON.parse(localStorage.getItem('PLACEOS_BUILD.Lockers') || '[]');
        this._locker_list.next(data);
    }

    private _store() {
        localStorage.setItem('PLACEOS_BUILD.Lockers', JSON.stringify(this._locker_list.getValue()));
    }
}