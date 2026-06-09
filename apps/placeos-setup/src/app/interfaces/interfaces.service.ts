import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { randomInt } from '@placeos-tools/common';
import { openConfirmModal } from 'libs/components/src/lib/confirm-modal.component';
import { BehaviorSubject } from 'rxjs';
import { InterfaceDetailsModalComponent } from './interface-details-modal.component';
import { InterfaceModalComponent } from './interface-modal.component';

export interface Interface {
    id: string;
    building_id: string;
    building_name: string;
    required: string[];
    workplace: {
        required: boolean;
        meetings: boolean;
        catering: boolean;
        assets: boolean;
        desks: boolean;
        group_desks: boolean;
        parking: boolean;
        lockers: boolean;
        visitors: boolean;
        standalone_visitors: boolean;
    };
    concierge: {
        required: boolean;
        match_workplace: boolean;
    };
    booking_panel: {
        required: boolean;
        show_title: boolean;
        show_host: boolean;
        show_images: boolean;
        show_qrcode: boolean;
    };
    visitor_kiosk: {
        required: boolean;
        induction: boolean;
        catering: boolean;
    };
    map_kiosk: {
        required: boolean;
        touch_enabled: boolean;
    };
    outlook_plugin: {
        required: boolean;
        match_workplace: boolean;
    };
}

@Injectable({
    providedIn: 'root',
})
export class InterfacesService {
    private _dialog = inject(MatDialog);

    private _interface_list = new BehaviorSubject<Interface[]>([
        {
            id: 'default',
            building_id: 'default',
            building_name: 'Default Config',
            required: ['workplace', 'concierge'],
            workplace: {
                required: true,
                meetings: true,
                catering: false,
                assets: false,
                desks: true,
                group_desks: false,
                parking: false,
                lockers: false,
                visitors: true,
                standalone_visitors: true,
            },
            concierge: {
                required: true,
                match_workplace: true,
            },
            booking_panel: {
                required: true,
                show_title: true,
                show_host: true,
                show_images: true,
                show_qrcode: true,
            },
            visitor_kiosk: {
                required: false,
                induction: true,
                catering: false,
            },
            map_kiosk: {
                required: false,
                touch_enabled: true,
            },
            outlook_plugin: {
                required: false,
                match_workplace: true,
            },
        },
    ]);
    private _selected = new BehaviorSubject<string[]>([]);

    public readonly interfaces = this._interface_list.asObservable();
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
                !state ? [] : this._interface_list.getValue().map((_) => _.id)
            );
            return;
        }
        if (!state) this._selected.next(list);
        else this._selected.next([...list, id]);
    }

    public setInterface(item: Interface) {
        if (!item.id) item.id = `interface-${randomInt(9999_9999, 1000_0000)}`;
        this._interface_list.next([
            ...this._interface_list.getValue().filter((_) => _.id !== item.id),
            item,
        ]);
        this._store();
    }

    public async removeInterface(item: Interface) {
        const { close, reason } = await openConfirmModal(
            {
                title: 'Remove Interface',
                content: `Are you sure you want to remove interface config for "${item.building_name}"?`,
                icon: { content: 'delete' },
            },
            this._dialog
        );
        if (reason !== 'done') return;
        this._interface_list.next(
            this._interface_list.getValue().filter((_) => _.id !== item.id)
        );
        this._store();
        close();
    }

    public async removeSelected() {
        const list = this._selected.getValue();
        if (!list.length) return;
        if (list.length === 1) {
            return this.removeInterface(
                this._interface_list.getValue().find((_) => _.id === list[0])
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
        this._interface_list.next(
            this._interface_list
                .getValue()
                .filter((_) => !list.find((id) => _.id === id))
        );
        this._selected.next([]);
        this._store();
        close();
    }

    public openInterfaceModal(item?: Interface) {
        const ref = this._dialog.open(InterfaceModalComponent, {
            data: item,
        });
        ref.componentInstance.onSave.subscribe((itm) => {
            this.setInterface(itm as any);
            ref.close();
        });
    }

    public openInterfaceDetailsModal(item: Interface) {
        this._dialog.open(InterfaceDetailsModalComponent, {
            data: item,
        });
    }

    private _load() {
        const data = JSON.parse(
            localStorage.getItem('PLACEOS_BUILD.Interfaces') || '[]'
        );
        this._interface_list.next(data);
    }

    private _store() {
        localStorage.setItem(
            'PLACEOS_BUILD.Interfaces',
            JSON.stringify(this._interface_list.getValue())
        );
    }
}
