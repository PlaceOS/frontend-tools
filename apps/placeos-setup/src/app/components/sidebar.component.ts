import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from '../../../../../libs/components/src/lib/icon.component';

@Component({
    selector: 'sidebar',
    template: `
        <div
            class="relative flex h-full w-48 flex-col bg-neutral-800 text-white"
        >
            <div class="flex flex-col items-center space-y-2">
                <a
                    [routerLink]="['/']"
                    class="font-heading mt-4 ml-16 w-[calc(100%-2rem)] pb-5 text-4xl sm:ml-0 dark:text-white"
                >
                    Place<span class="text-primary font-heading">OS</span>
                </a>
                <div
                    class="font-cursive absolute inset-x-0 top-11 border-b border-neutral-600 pr-2 pb-1 text-center text-xs italic"
                >
                    Build Sheet
                </div>
                @for (item of items(); track item) {
                    <a
                        menu
                        matRipple
                        class="flex w-[calc(100%-2rem)] items-center space-x-2 rounded p-2"
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
    public readonly items = signal([
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
    ]);
}
