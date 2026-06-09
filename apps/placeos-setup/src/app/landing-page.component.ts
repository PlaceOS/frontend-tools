import { Component, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../../libs/components/src/lib/icon.component';
import { ExportService } from './data/export.service';

@Component({
    selector: 'app-landing-page',
    template: `
        <div
            class="flex h-full w-full flex-col items-center space-y-2 overflow-auto p-4"
        >
            <h2 class="mx-auto w-[640px] text-2xl font-medium">
                Welcome to the PlaceOS Build Sheet Application
            </h2>
            <div
                class="flex w-[640px] flex-col space-y-2 rounded border border-gray-200 bg-white p-4 dark:border-neutral-500 dark:bg-neutral-700"
            >
                <div
                    class="bg-pending flex items-center space-x-2 rounded p-2 text-sm text-black shadow"
                >
                    <app-icon class="text-xl">warning</app-icon>
                    <div>Before continuing please read this carefully.</div>
                </div>
                <p class="p-2">
                    Identifiers for resources() such as Rooms and Desks are
                    permanent and won't be able to be changed one they are added
                    to the live PlaceOS instance.
                </p>
                <p class="p-2">
                    It is strongly recommended to set unique identitiers for
                    these resources() that match up with the ones that have been
                    assigned to the floorplan.
                </p>
            </div>
            <h3 class="mx-auto w-[640px] pt-4 text-xl font-medium">
                Available Resources to setup
            </h3>
            <div
                class="flex w-[640px] flex-wrap rounded border border-gray-200 bg-white p-4 dark:border-neutral-500 dark:bg-neutral-700"
            >
                @for (item of resources(); track item) {
                    <a
                        menu
                        matRipple
                        class="m-2 flex w-[30%] items-center space-x-2 rounded border border-gray-200 px-2 dark:border-neutral-500"
                        [routerLink]="[item.route]"
                    >
                        <app-icon [icon]="item.icon" />
                        <p class="flex-1 py-2">{{ item?.name }}</p>
                        @if (item.count && item.count() > 0) {
                            <app-icon class="-mr-2 text-2xl text-green-600">
                                done
                            </app-icon>
                        }
                    </a>
                }
            </div>
            <h3 class="mx-auto w-[640px] pt-4 text-xl font-medium">
                Finialising and finishing up
            </h3>
            <div
                class="flex w-[640px] flex-col space-y-2 rounded border border-gray-200 bg-white p-4 dark:border-neutral-500 dark:bg-neutral-700"
            >
                <div
                    class="bg-pending flex items-center space-x-2 rounded p-2 text-sm text-black shadow"
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
    imports: [IconComponent, RouterLink, MatButton],
})
export class LandingPageComponent {
    private _export = inject(ExportService);

    public readonly resources = signal([
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
    ]);

    public readonly export = () => this._export.exportData();
}
