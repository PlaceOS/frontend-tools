import { computed, inject, Injectable } from '@angular/core';
import { downloadFile } from '@placeos-tools/common';
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
    private _org = inject(OrganisationService);
    private _interfaces = inject(InterfacesService);
    private _floorplan = inject(FloorPlansService);
    private _spaces = inject(SpacesService);
    private _desks = inject(DesksService);
    private _lockers = inject(LockersService);
    private _zones = inject(ZonesService);
    private _catering = inject(CateringStateService);
    private _parking = inject(CarSpacesService);
    private _assets = inject(AssetsService);
    private _monitoring = inject(MonitoringService);
    private _access_control = inject(AccessControlService);

    public readonly building_count = computed(
        () => this._org.buildings().length,
    );
    public readonly level_count = computed(() => this._org.levels().length);
    public readonly org_zone_count = computed(
        () => this.building_count() + this.level_count(),
    );
    public readonly interface_count = computed(
        () => this._interfaces.interfaces().length,
    );
    public readonly floorplan_count = computed(
        () => this._floorplan.floorplans().length,
    );
    public readonly space_count = computed(() => this._spaces.spaces().length);
    public readonly desk_count = computed(() => this._desks.desks().length);
    public readonly locker_count = computed(
        () => this._lockers.lockers().length,
    );
    public readonly zone_count = computed(() => this._zones.zones().length);
    public readonly catering_count = computed(
        () => this._catering.menu_list().length > 1,
    );
    public readonly parking_count = computed(
        () => this._parking.spaces().length,
    );
    public readonly asset_count = computed(() => this._assets.assets().length);
    public readonly region_count = computed(
        () => this._monitoring.item_list().length,
    );
    public readonly access_control_count = computed(
        () => this._access_control.access_controls().length,
    );

    public async exportData() {
        console.log('Export');
        const data = {
            buildings: this._org.buildings(),
            levels: this._org.levels(),
            interfaces: this._interfaces.interfaces(),
            floorplans: this._floorplan.floorplans(),
            rooms: this._spaces.spaces(),
            desks: this._desks.desks(),
            lockers: this._lockers.lockers(),
            zones: this._zones.zones(),
            catering: this._catering.menu_list(),
            parking_spaces: this._parking.spaces(),
            assets: this._assets.assets(),
            regions: this._monitoring.item_list(),
            access_controls: this._access_control.access_controls(),
        };
        console.log('Data:', data);
        downloadFile('placeos-build.json', JSON.stringify(data, undefined, 4));
    }
}
