import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { randomInt } from '@placeos-tools/common';
import { openConfirmModal } from 'libs/components/src/lib/confirm-modal.component';
import { BehaviorSubject } from 'rxjs';
import { AccessControlModalComponent } from './access-control-modal.component';

export interface AccessControl {
    id: string;
    building_id: string;
    type: string;
    managed_onsite: boolean;
    isolated: boolean;
    linked_to_staff_db: boolean;
    access_tied_to_identity: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class AccessControlService {
    private _dialog = inject(MatDialog);

    private _access_control_list = new BehaviorSubject<AccessControl[]>([
        {
            id: 'test',
            building_id: 'bld-01',
            type: 'Lenel',
            managed_onsite: true,
            isolated: true,
            linked_to_staff_db: true,
            access_tied_to_identity: true,
        },
    ]);

    private _selected = new BehaviorSubject<string[]>([]);

    public readonly access_controls = this._access_control_list.asObservable();
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
                !state
                    ? []
                    : this._access_control_list.getValue().map((_) => _.id)
            );
            return;
        }
        if (!state) this._selected.next(list);
        else this._selected.next([...list, id]);
    }

    public setAccessControl(accesscontrol: AccessControl) {
        if (!accesscontrol.id)
            accesscontrol.id = `ac-${randomInt(9999_9999, 1000_0000)}`;
        this._access_control_list.next([
            ...this._access_control_list
                .getValue()
                .filter((_) => _.id !== accesscontrol.id),
            accesscontrol,
        ]);
        this._store();
    }

    public async removeAccessControl(item: AccessControl) {
        const { close, reason } = await openConfirmModal(
            {
                title: 'Remove Access Control',
                content: `Are you sure you want to remove settings for "${item.building_id}" of "${item.type}"?`,
                icon: { content: 'delete' },
            },
            this._dialog
        );
        if (reason !== 'done') return;
        this._access_control_list.next(
            this._access_control_list.getValue().filter((_) => _.id !== item.id)
        );
        this._store();
        close();
    }

    public async removeSelected() {
        const list = this._selected.getValue();
        if (!list.length) return;
        if (list.length === 1) {
            return this.removeAccessControl(
                this._access_control_list
                    .getValue()
                    .find((_) => _.id === list[0])
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
        this._access_control_list.next(
            this._access_control_list
                .getValue()
                .filter((_) => !list.find((id) => _.id === id))
        );
        this._selected.next([]);
        this._store();
        close();
    }

    public openAccessControlModal(accesscontrol?: AccessControl) {
        const ref = this._dialog.open(AccessControlModalComponent, {
            data: accesscontrol,
        });
        ref.componentInstance.onSave.subscribe((accesscontrol) => {
            this.setAccessControl(accesscontrol as any);
            ref.close();
        });
    }

    private _load() {
        const data = JSON.parse(
            localStorage.getItem('PLACEOS_BUILD.AccessControls') || '[]'
        );
        this._access_control_list.next(data);
    }

    private _store() {
        localStorage.setItem(
            'PLACEOS_BUILD.AccessControls',
            JSON.stringify(this._access_control_list.getValue())
        );
    }
}
