import { Injectable } from "@angular/core";
import { randomInt } from "@placeos-tools/common";
import { BehaviorSubject } from "rxjs";

export interface Building {
    id: string;
    display_name: string;
    name: string;
    country: string;
    city: string;
    address: string;
    currency: string;
    allow_visitors: boolean;
    catering_available: boolean;
}

export interface BuildingLevel {
    id: string;
    parent_id: string;
    display_name: string;
    name: string;
    allow_visitors?: boolean;
    catering_available?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class OrganisationService {
    private _building_list = new BehaviorSubject<Building[]>([{
        id: 'test',
        display_name: 'Test Building 1',
        name: 'Building 1',
        country: 'Australia',
        city: 'Sydney',
        address: '10 Market Place',
        currency: 'AUD',
        allow_visitors: false,
        catering_available: true,
    },{
        id: 'test2',
        display_name: 'Test Building 2',
        name: 'Building 2',
        country: 'Australia',
        city: 'Brisbane',
        address: '11 Market Place',
        currency: 'AUD',
        allow_visitors: true,
        catering_available: false,
    }]);
    private _floor_list = new BehaviorSubject<BuildingLevel[]>([{
        id: 'test-lvl',
        parent_id: 'test',
        display_name: 'Test Level 1',
        name: 'Level 1',
        allow_visitors: false,
        catering_available: true,
    }]);

    public readonly buildings = this._building_list.asObservable();
    public readonly levels = this._floor_list.asObservable();

    constructor() {
        // this._load();
    }

    public setBuilding(bld: Building) {
        if (!bld.id) bld.id = `bld-${randomInt(9999_9999, 1000_0000)}`;
        this._building_list.next([...this._building_list.getValue().filter(_ => _.id !== bld.id), bld]);
    }

    public setLevel(lvl: BuildingLevel) {
        if (!lvl.id) lvl.id = `lvl-${randomInt(9999_9999, 1000_0000)}`;
        this._floor_list.next([...this._floor_list.getValue().filter(_ => _.id !== lvl.id), lvl]);
    }

    private _load() {
        const bld_data = JSON.parse(localStorage.getItem('PLACEOS_BUILD.Buildings') || '[]');
        this._building_list.next(bld_data);
        const lvl_data = JSON.parse(localStorage.getItem('PLACEOS_BUILD.Levels') || '[]');
        this._floor_list.next(lvl_data);
    }

    private _store() {
        localStorage.setItem('PLACEOS_BUILD.Buildings', JSON.stringify(this._building_list.getValue()));
        localStorage.setItem('PLACEOS_BUILD.Levels', JSON.stringify(this._floor_list.getValue()));
    }
}
