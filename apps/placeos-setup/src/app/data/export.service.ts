import { Injectable } from '@angular/core';
import { downloadFile } from '@placeos-tools/common';
import { combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AccessControlService } from '../access-control/access-control.service';
import { AssetsService } from '../assets/assets.service';
import { CarSpacesService } from '../car-spaces/car-spaces.service';
import { CateringStateService } from '../catering/catering-state.service';
import { DesksService } from '../desks/desks.service';
import { FloorPlansService } from '../floorplans/floorplans.service';
import { InterfacesService } from '../interfaces/interfaces.service';
import { LockersService } from '../lockers/lockers.service';
import { MonitoringService } from '../monitoring/monitoring.service';
import { OrganisationService } from '../organisation/organisation.service';
import { SpacesService } from '../spaces/spaces.service';
import { ZonesService } from '../zoning/zoning.service';

@Injectable({
    providedIn: 'root',
})
export class ExportService {
    public readonly building_count = this._org.buildings.pipe(
        map((_) => _.length)
    );
    public readonly level_count = this._org.levels.pipe(map((_) => _.length));
    public readonly org_zone_count = combineLatest([
        this.building_count,
        this.level_count,
    ]).pipe(map(([b, l]) => b + l));
    public readonly interface_count = this._interfaces.interfaces.pipe(
        map((_) => _.length)
    );
    public readonly floorplan_count = this._floorplan.floorplans.pipe(
        map((_) => _.length)
    );
    public readonly space_count = this._spaces.spaces.pipe(
        map((_) => _.length)
    );
    public readonly desk_count = this._desks.desks.pipe(map((_) => _.length));
    public readonly locker_count = this._lockers.lockers.pipe(
        map((_) => _.length)
    );
    public readonly zone_count = this._zones.zones.pipe(map((_) => _.length));
    public readonly catering_count = this._catering.menu_list.pipe(
        map((_) => _.length > 1)
    );
    public readonly parking_count = this._parking.spaces.pipe(
        map((_) => _.length)
    );
    public readonly asset_count = this._assets.assets.pipe(
        map((_) => _.length)
    );
    public readonly region_count = this._monitoring.item_list.pipe(
        map((_) => _.length)
    );
    public readonly access_control_count =
        this._access_control.access_controls.pipe(map((_) => _.length));

    constructor(
        private _org: OrganisationService,
        private _interfaces: InterfacesService,
        private _floorplan: FloorPlansService,
        private _spaces: SpacesService,
        private _desks: DesksService,
        private _lockers: LockersService,
        private _zones: ZonesService,
        private _catering: CateringStateService,
        private _parking: CarSpacesService,
        private _assets: AssetsService,
        private _monitoring: MonitoringService,
        private _access_control: AccessControlService
    ) {}

    public async exportData() {
        console.log('Export');
        const data = await combineLatest([
            this._org.buildings,
            this._org.levels,
            this._interfaces.interfaces,
            this._floorplan.floorplans,
            this._spaces.spaces,
            this._desks.desks,
            this._lockers.lockers,
            this._zones.zones,
            this._catering.menu_list,
            this._parking.spaces,
            this._assets.assets,
            this._monitoring.item_list,
            this._access_control.access_controls
        ])
            .pipe(
                take(1),
                map(
                    ([
                        buildings,
                        levels,
                        interfaces,
                        floorplans,
                        rooms,
                        desks,
                        lockers,
                        zones,
                        catering,
                        parking_spaces,
                        assets,
                        regions,
                        access_controls
                    ]) => ({
                        buildings,
                        levels,
                        interfaces,
                        floorplans,
                        rooms,
                        desks,
                        lockers,
                        zones,
                        catering,
                        parking_spaces,
                        assets,
                        regions,
                        access_controls
                    })
                )
            )
            .toPromise();
        console.log('Data:', data);
        downloadFile('placeos-build.json', JSON.stringify(data, undefined, 4));
    }
}
