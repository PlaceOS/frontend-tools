import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { randomInt } from "@placeos-tools/common";
import { openConfirmModal } from "libs/components/src/lib/confirm-modal.component";
import { BehaviorSubject } from "rxjs";
import { SpaceModalComponent } from "./space-modal.component";

export interface Space {
    id: string;
    room_id: string;
    building_id: string;
    level_id: string;
    display_name: string;
    name: string;
    email: string;
    capacity: number;
    type: string;
    features: string[];
    pets_allowed: true,
    catering_available: true,
    requires_approval: true,
    visitors: true,
    whitelist_groups: string[];
    auto_release: true,
    auto_release_delay: number;
    sensor_brand: string;
    recurrence: true,
    max_recurrence: number;
    all_day: true,
    images: string[];
}

@Injectable({
    providedIn: 'root'
})
export class SpacesService {
    private _space_list = new BehaviorSubject<Space[]>([{
        id: 'test',
        room_id: 'space-01',
        building_id: 'bld-01',
        level_id: 'lvl-01',
        display_name: 'Meeting Room',
        name: 'Room',
        email: 'room-01@place.tech',
        capacity: 10,
        type: '',
        features: [],
        pets_allowed: true,
        catering_available: true,
        requires_approval: true,
        visitors: true,
        whitelist_groups: [],
        auto_release: true,
        auto_release_delay: 10,
        sensor_brand: 'Kontakt IO',
        recurrence: true,
        max_recurrence: 2,
        all_day: true,
        images: []
    }]);

    public readonly spaces = this._space_list.asObservable();

    constructor(private _dialog: MatDialog) {}

    public setSpace(space: Space) {
        if (!space.id) space.id = `space-${randomInt(9999_9999, 1000_0000)}`;
        this._space_list.next([...this._space_list.getValue().filter(_ => _.id !== space.id), space]);
        this._store();
    }

    public async removeSpace(space: Space) {
        const { close, reason } = await openConfirmModal({
            title: 'Remove Room',
            content: `Are you sure you want to remove room "${space.display_name || space.name}"?`,
            icon: { content: 'delete' }
        }, this._dialog);
        if (reason !== 'done') return;
        this._space_list.next(this._space_list.getValue().filter(_ => _.id !== space.id));
        this._store();
        close();
    }

    public openSpaceModal(space?: Space) {
        const ref = this._dialog.open(SpaceModalComponent, {
            data: space
        });
        ref.componentInstance.onSave.subscribe((space) => {
            this.setSpace(space as any);
            ref.close();
        });
    }

    private _load() {
        const data = JSON.parse(localStorage.getItem('PLACEOS_BUILD.Spaces') || '[]');
        this._space_list.next(data);
    }

    private _store() {
        localStorage.setItem('PLACEOS_BUILD.Spaces', JSON.stringify(this._space_list.getValue()));
    }
}