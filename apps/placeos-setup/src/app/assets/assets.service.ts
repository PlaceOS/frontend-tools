import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { randomInt } from "@placeos-tools/common";
import { openConfirmModal } from "libs/components/src/lib/confirm-modal.component";
import { BehaviorSubject } from "rxjs";
import { AssetModalComponent } from "./asset-modal.component";

export interface Asset {
    id: string;
    building_id: string;
    name: string;
    brand: string;
    category: string;
    barcode: string;
    purchase_date: string;
    good_until: string;
    consumable: boolean;
    quantity: number,
    remind_returns: boolean,
    reminder_delay: number;
    available_for_desks: boolean;
    available_for_spaces: boolean,
}

@Injectable({
    providedIn: 'root'
})
export class AssetsService {
    private _asset_list = new BehaviorSubject<Asset[]>([{
        id: 'test',
        building_id: 'bld-01',
        name: 'Asset',
        brand: '',
        category: '',
        barcode: '',
        purchase_date: '10/02/2022',
        good_until: '10/02/2025',
        consumable: true,
        quantity: 10,
        remind_returns: true,
        reminder_delay: 24,
        available_for_desks: true,
        available_for_spaces: true,
    }]);

    private _selected = new BehaviorSubject<string[]>([]);

    public readonly assets = this._asset_list.asObservable();
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
            this._selected.next(!state ? [] : this._asset_list.getValue().map(_ => _.id));
            return;
        }
        if (!state) this._selected.next(list);
        else this._selected.next([...list, id]);
    }

    public setAsset(asset: Asset) {
        if (!asset.id) asset.id = `asset-${randomInt(9999_9999, 1000_0000)}`;
        this._asset_list.next([...this._asset_list.getValue().filter(_ => _.id !== asset.id), asset]);
        this._store();
    }

    public async removeAsset(asset: Asset) {
        const { close, reason } = await openConfirmModal({
            title: 'Remove Asset',
            content: `Are you sure you want to remove asset "${asset.name}"?`,
            icon: { content: 'delete' }
        }, this._dialog);
        if (reason !== 'done') return;
        this._asset_list.next(this._asset_list.getValue().filter(_ => _.id !== asset.id));
        this._store();
        close();
    }

    public async removeSelected() {
        const list = this._selected.getValue();
        if (!list.length) return;
        if (list.length === 1) {
            return this.removeAsset(this._asset_list.getValue().find(_ => _.id === list[0]));
        }
        const { close, reason } = await openConfirmModal({
            title: 'Remove regions',
            content: `Are you sure you want to remove ${list.length} regions?`,
            icon: { content: 'delete' }
        }, this._dialog);
        if (reason !== 'done') return;
        this._asset_list.next(this._asset_list.getValue().filter(_ => !list.find(id => _.id === id)));
        this._selected.next([]);
        this._store();
        close();
    }

    public openAssetModal(asset?: Asset) {
        const ref = this._dialog.open(AssetModalComponent, {
            data: asset
        });
        ref.componentInstance.onSave.subscribe((asset) => {
            this.setAsset(asset as any);
            ref.close();
        });
    }

    private _load() {
        const data = JSON.parse(localStorage.getItem('PLACEOS_BUILD.Assets') || '[]');
        this._asset_list.next(data);
    }

    private _store() {
        localStorage.setItem('PLACEOS_BUILD.Assets', JSON.stringify(this._asset_list.getValue()));
    }
}