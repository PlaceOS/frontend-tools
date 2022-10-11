import { Injectable, Input } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { OrganisationService } from "../organisation/organisation.service";

export interface InterfaceSettings {
    id: string;
    workplace: WorkplaceInterfaceSettings;
    booking_panel: BookingPanelInterfaceSettings;
    visitor_kiosk: VisitorKioskInterfaceSettings;
    concierge: boolean;
    map_kiosk: boolean;
    outlook_addin: boolean;
}

export interface WorkplaceInterfaceSettings {
    meetings: boolean;
    catering: boolean;
    external_attendees: boolean;
    desks: boolean;
    desk_groups: boolean;
    parking: boolean;
    lockers: boolean;
    assets: boolean;
    visitors: boolean;
    schedule: boolean;
}

export interface BookingPanelInterfaceSettings {
    required: boolean;
    show_title: boolean;
    show_host: boolean;
    show_image: boolean;
    show_checkin_qr: boolean;
}

export interface VisitorKioskInterfaceSettings {
    required: boolean;
    induction: boolean;
    catering: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class InterfacesService {
    private _interface_list = new BehaviorSubject<InterfaceSettings[]>([{ id: 'root', workplace: {}, booking_panel: {}, visitor_kiosk: {} } as any]);

    public readonly interfaces = this._interface_list.asObservable();

    constructor(private _org: OrganisationService) {}
}
