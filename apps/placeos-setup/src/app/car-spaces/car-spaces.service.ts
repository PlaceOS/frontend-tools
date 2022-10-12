import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { randomInt } from "@placeos-tools/common";
import { openConfirmModal } from "libs/components/src/lib/confirm-modal.component";
import { BehaviorSubject } from "rxjs";
import { CarSpaceModalComponent } from "./car-space-modal.component";

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
    plate_recognition: boolean,
    auto_release: boolean,
    auto_release_delay: number;
    sensor_brand: string;
    recurrence: true,
    max_recurrence: number;
}

@Injectable({
    providedIn: 'root'
})
export class CarSpacesService {
    private _space_list = new BehaviorSubject<CarSpace[]>([{
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
        max_recurrence: 2
    }]);

    public readonly spaces = this._space_list.asObservable();

    constructor(private _dialog: MatDialog) {}

    public setCarSpace(carspace: CarSpace) {
        if (!carspace.id) carspace.id = `carspace-${randomInt(9999_9999, 1000_0000)}`;
        this._space_list.next([...this._space_list.getValue().filter(_ => _.id !== carspace.id), carspace]);
        this._store();
    }

    public async removeCarSpace(carspace: CarSpace) {
        const { close, reason } = await openConfirmModal({
            title: 'Remove CarSpace',
            content: `Are you sure you want to remove carspace "${carspace.display_name || carspace.name}"?`,
            icon: { content: 'delete' }
        }, this._dialog);
        if (reason !== 'done') return;
        this._space_list.next(this._space_list.getValue().filter(_ => _.id !== carspace.id));
        this._store();
        close();
    }

    public openCarSpaceModal(carspace?: CarSpace) {
        const ref = this._dialog.open(CarSpaceModalComponent, {
            data: carspace
        });
        ref.componentInstance.onSave.subscribe((carspace) => {
            this.setCarSpace(carspace as any);
            ref.close();
        });
    }

    private _load() {
        const data = JSON.parse(localStorage.getItem('PLACEOS_BUILD.CarSpaces') || '[]');
        this._space_list.next(data);
    }

    private _store() {
        localStorage.setItem('PLACEOS_BUILD.CarSpaces', JSON.stringify(this._space_list.getValue()));
    }
}