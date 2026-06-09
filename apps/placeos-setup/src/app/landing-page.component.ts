import { Component } from '@angular/core';
import { ExportService } from './data/export.service';
import { IconComponent } from '../../../../libs/components/src/lib/icon.component';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-landing-page',
    template: `
        <div
            class="flex flex-col items-center w-full h-full overflow-auto p-4 space-y-2"
        >
            <h2 class="text-2xl font-medium w-[640px] mx-auto">
                Welcome to the PlaceOS Build Sheet Application
            </h2>
            <div
                class="flex flex-col w-[640px] bg-white dark:bg-neutral-700 border border-gray-200 dark:border-neutral-500 rounded p-4 space-y-2"
            >
                <div
                    class="flex items-center p-2 bg-pending rounded shadow text-black text-sm space-x-2"
                >
                    <app-icon class="text-xl">warning</app-icon>
                    <div>Before continuing please read this carefully.</div>
                </div>
                <p class="p-2">
                    Identifiers for resources such as Rooms and Desks are
                    permanent and won't be able to be changed one they are added
                    to the live PlaceOS instance.
                </p>
                <p class="p-2">
                    It is strongly recommended to set unique identitiers for
                    these resources that match up with the ones that have been
                    assigned to the floorplan.
                </p>
            </div>
            <h3 class="text-xl pt-4 font-medium w-[640px] mx-auto">
                Available Resources to setup
            </h3>
            <div
                class="flex flex-wrap w-[640px] bg-white dark:bg-neutral-700 border border-gray-200 dark:border-neutral-500 rounded p-4"
            >
                @for (item of resources; track item) {
                <a
                    menu
                    matRipple
                    class="flex items-center px-2 rounded m-2 w-[30%] border border-gray-200 dark:border-neutral-500 space-x-2"
                    [routerLink]="[item.route]"
                >
                    <app-icon [icon]="item.icon"></app-icon>
                    <p class="flex-1 py-2">{{ item?.name }}</p>
                    @if (item.count && (item.count | async) > 0) {
                    <app-icon class="text-green-600 text-2xl -mr-2">
                        done
                    </app-icon>
                    }
                </a>
                }
            </div>
            <h3 class="text-xl pt-4 font-medium w-[640px] mx-auto">
                Finialising and finishing up
            </h3>
            <div
                class="flex flex-col w-[640px] bg-white dark:bg-neutral-700 border border-gray-200 dark:border-neutral-500 rounded p-4 space-y-2"
            >
                <div
                    class="flex items-center p-2 bg-pending rounded shadow text-black text-sm space-x-2"
                >
                    <app-icon class="text-xl">warning</app-icon>
                    <div>
                        Please make sure you have filled out the all the
                        relavant sections of the application.
                    </div>
                </div>
                <p class="p-2">
                    Once you have finished filling out the sections of this
                    application you can click the export button below to
                    generate a metadata file to be used to configure PlaceOS.
                </p>
                <button mat-button (click)="export()">
                    Export PlaceOS Build Configuration
                </button>
            </div>
        </div>
    `,
    styles: [``],
    imports: [IconComponent, RouterLink, MatButton, AsyncPipe],
})
export class LandingPageComponent {
    public readonly resources = [
        {
            name: 'Organisation',
            route: '/organisation',
            icon: { content: 'business' },
            count: this._export.org_zone_count,
        },
        {
            name: 'Interfaces',
            route: '/interfaces',
            icon: { content: 'web_asset' },
            count: this._export.interface_count,
        },
        {
            name: 'Floorplans',
            route: '/floorplans',
            icon: { content: 'map' },
            count: this._export.floorplan_count,
        },
        {
            name: 'Rooms',
            route: '/spaces',
            icon: { content: 'meeting_room' },
            count: this._export.space_count,
        },
        {
            name: 'Desks',
            route: '/desks',
            icon: { content: 'desk' },
            count: this._export.desk_count,
        },
        {
            name: 'Lockers',
            route: '/lockers',
            icon: { content: 'key' },
            count: this._export.locker_count,
        },
        {
            name: 'Zoning',
            route: '/zoning',
            icon: { content: 'hive' },
            count: this._export.zone_count,
        },
        {
            name: 'Catering',
            route: '/catering',
            icon: { content: 'restaurant' },
            count: this._export.catering_count,
        },
        {
            name: 'Parking',
            route: '/parking',
            icon: { content: 'directions_car' },
            count: this._export.parking_count,
        },
        {
            name: 'Assets',
            route: '/assets',
            icon: { content: 'category' },
            count: this._export.asset_count,
        },
        {
            name: 'Monitoring',
            route: '/monitoring',
            icon: { content: 'screenshot_monitor' },
            count: this._export.region_count,
        },
        {
            name: 'Access Control',
            route: '/access-control',
            icon: { content: 'badge' },
            count: this._export.access_control_count,
        },
    ];

    public readonly export = () => this._export.exportData();

    constructor(private _export: ExportService) {}
}
