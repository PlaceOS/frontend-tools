import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from '../../../../../libs/components/src/lib/icon.component';

@Component({
    selector: 'sidebar',
    template: `
        <div
            class="flex flex-col bg-neutral-800 w-48 text-white h-full relative"
        >
            <div class="flex flex-col items-center space-y-2">
                <a
                    [routerLink]="['/']"
                    class="font-heading text-4xl mt-4 w-[calc(100%-2rem)] dark:text-white ml-16 sm:ml-0 pb-5"
                >
                    Place<span class="text-primary font-heading">OS</span>
                </a>
                <div
                    class="absolute top-11 inset-x-0 text-xs text-center italic font-cursive pr-2 pb-1 border-b border-neutral-600"
                >
                    Build Sheet
                </div>
                @for (item of items; track item) {
                <a
                    menu
                    matRipple
                    class="flex items-center p-2 rounded space-x-2 w-[calc(100%-2rem)]"
                    [routerLink]="[item.route]"
                    routerLinkActive="active"
                >
                    <app-icon [icon]="item.icon" />
                    <p>{{ item?.name }}</p>
                </a>
                }
            </div>
        </div>
    `,
    styles: [
        `
            a.active {
                background-color: #fff3 !important;
                color: var(--ternary) !important;
            }
        `,
    ],
    imports: [RouterLink, RouterLinkActive, IconComponent],
})
export class SidebarComponent {
    public readonly items = [
        { name: 'Home', route: '/home', icon: { content: 'home' } },
        {
            name: 'Organisation',
            route: '/organisation',
            icon: { content: 'business' },
        },
        {
            name: 'Interfaces',
            route: '/interfaces',
            icon: { content: 'web_asset' },
        },
        { name: 'Floorplans', route: '/floorplans', icon: { content: 'map' } },
        { name: 'Rooms', route: '/spaces', icon: { content: 'meeting_room' } },
        { name: 'Desks', route: '/desks', icon: { content: 'desk' } },
        { name: 'Lockers', route: '/lockers', icon: { content: 'key' } },
        { name: 'Zoning', route: '/zoning', icon: { content: 'hive' } },
        {
            name: 'Catering',
            route: '/catering',
            icon: { content: 'restaurant' },
        },
        {
            name: 'Parking',
            route: '/parking',
            icon: { content: 'directions_car' },
        },
        { name: 'Assets', route: '/assets', icon: { content: 'category' } },
        {
            name: 'Monitoring',
            route: '/monitoring',
            icon: { content: 'screenshot_monitor' },
        },
        {
            name: 'Access Control',
            route: '/access-control',
            icon: { content: 'badge' },
        },
    ];
}
