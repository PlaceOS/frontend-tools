import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { randomInt } from "@placeos-tools/common";
import { openConfirmModal } from "libs/components/src/lib/confirm-modal.component";
import { BehaviorSubject } from "rxjs";
import { FloorPlanModalComponent } from "./floorplan-modal.component";

export interface FloorPlan {
    id: string;
    building_id: string;
    level_id: string;
    map_available: boolean;
    features_setup: boolean;
    zones_setup: boolean;
    sensors_setup: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class FloorPlansService {
    private _floorplan_list = new BehaviorSubject<FloorPlan[]>([{
        id: 'test',
        building_id: 'bld-01',
        level_id: 'lvl-01',
        map_available: true,
        features_setup: true,
        zones_setup: true,
        sensors_setup: true,
    }]);


    private _selected = new BehaviorSubject<string[]>([]);

    public readonly floorplans = this._floorplan_list.asObservable();
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
            this._selected.next(!state ? [] : this._floorplan_list.getValue().map(_ => _.id));
            return;
        }
        if (!state) this._selected.next(list);
        else this._selected.next([...list, id]);
    }

    public setFloorPlan(item: FloorPlan) {
        if (!item.id) item.id = `floorplan-${randomInt(9999_9999, 1000_0000)}`;
        this._floorplan_list.next([...this._floorplan_list.getValue().filter(_ => _.id !== item.id), item]);
        this._store();
    }

    public async removeFloorPlan(item: FloorPlan) {
        const { close, reason } = await openConfirmModal({
            title: 'Remove FloorPlan',
            content: `Are you sure you want to remove floorplan "${item.building_id}" "${item.level_id}" ?`,
            icon: { content: 'delete' }
        }, this._dialog);
        if (reason !== 'done') return;
        this._floorplan_list.next(this._floorplan_list.getValue().filter(_ => _.id !== item.id));
        this._store();
        close();
    }

    public async removeSelected() {
        const list = this._selected.getValue();
        if (!list.length) return;
        if (list.length === 1) {
            return this.removeFloorPlan(this._floorplan_list.getValue().find(_ => _.id === list[0]));
        }
        const { close, reason } = await openConfirmModal({
            title: 'Remove regions',
            content: `Are you sure you want to remove ${list.length} regions?`,
            icon: { content: 'delete' }
        }, this._dialog);
        if (reason !== 'done') return;
        this._floorplan_list.next(this._floorplan_list.getValue().filter(_ => !list.find(id => _.id === id)));
        this._selected.next([]);
        this._store();
        close();
    }

    public openFloorPlanModal(item?: FloorPlan) {
        const ref = this._dialog.open(FloorPlanModalComponent, {
            data: item
        });
        ref.componentInstance.onSave.subscribe((floorplan) => {
            this.setFloorPlan(floorplan as any);
            ref.close();
        });
    }

    private _load() {
        const data = JSON.parse(localStorage.getItem('PLACEOS_BUILD.FloorPlans') || '[]');
        this._floorplan_list.next(data);
    }

    private _store() {
        localStorage.setItem('PLACEOS_BUILD.FloorPlans', JSON.stringify(this._floorplan_list.getValue()));
    }
}