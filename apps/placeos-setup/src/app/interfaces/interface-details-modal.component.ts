import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { Interface } from './interfaces.service';
import { MatIconButton } from '@angular/material/button';
import { IconComponent } from '../../../../../libs/components/src/lib/icon.component';

@Component({
    selector: 'interface-details-modal',
    template: `
        <header
            class="w-full flex items-center justify-between p-2 bg-white dark:bg-neutral-700 border-b border-gray-300 dark:border-neutral-500"
        >
            <h2 class="px-2 font-medium">
                Interface Details for {{ item.building_name }}
            </h2>
            <button mat-icon-button mat-dialog-close>
                <app-icon>close</app-icon>
            </button>
        </header>
        <main class="bg-gray-200 dark:bg-neutral-600 p-2 flex flex-wrap">
            <div
                class="m-2 rounded bg-white flex-grow-1 dark:bg-neutral-700 border border-gray-300 dark:border-neutral-500"
            >
                <h3
                    class="w-full p-2 border-b border-gray-300 dark:border-neutral-500"
                >
                    Workplace
                </h3>
                <div class="flex flex-wrap max-w-[24rem]">
                    <div class="flex items-center p-2 space-x-2">
                        <div class="text-xs">Meeting Bookings</div>
                        <app-icon
                            class="text-2xl"
                            [class.text-green-600]="item.workplace.meetings"
                            [class.text-red-600]="!item.workplace.meetings"
                        >
                            {{ item.workplace.meetings ? 'done' : 'close' }}
                        </app-icon>
                    </div>
                    <div class="flex items-center p-2 space-x-2">
                        <div class="text-xs">Catering Available</div>
                        <app-icon
                            class="text-2xl"
                            [class.text-green-600]="item.workplace.catering"
                            [class.text-red-600]="!item.workplace.catering"
                        >
                            {{ item.workplace.catering ? 'done' : 'close' }}
                        </app-icon>
                    </div>
                    <div class="flex items-center p-2 space-x-2">
                        <div class="text-xs">Assets Available</div>
                        <app-icon
                            class="text-2xl"
                            [class.text-green-600]="item.workplace.assets"
                            [class.text-red-600]="!item.workplace.assets"
                        >
                            {{ item.workplace.assets ? 'done' : 'close' }}
                        </app-icon>
                    </div>
                    <div class="flex items-center p-2 space-x-2">
                        <div class="text-xs">Desk Bookings</div>
                        <app-icon
                            class="text-2xl"
                            [class.text-green-600]="item.workplace.catering"
                            [class.text-red-600]="!item.workplace.catering"
                        >
                            {{ item.workplace.catering ? 'done' : 'close' }}
                        </app-icon>
                    </div>
                    <div class="flex items-center p-2 space-x-2">
                        <div class="text-xs">Group Desk Bookings</div>
                        <app-icon
                            class="text-2xl"
                            [class.text-green-600]="item.workplace.group_desks"
                            [class.text-red-600]="!item.workplace.group_desks"
                        >
                            {{ item.workplace.group_desks ? 'done' : 'close' }}
                        </app-icon>
                    </div>
                    <div class="flex items-center p-2 space-x-2">
                        <div class="text-xs">Car Space Bookings</div>
                        <app-icon
                            class="text-2xl"
                            [class.text-green-600]="item.workplace.parking"
                            [class.text-red-600]="!item.workplace.parking"
                        >
                            {{ item.workplace.parking ? 'done' : 'close' }}
                        </app-icon>
                    </div>
                    <div class="flex items-center p-2 space-x-2">
                        <div class="text-xs">Locker Bookings</div>
                        <app-icon
                            class="text-2xl"
                            [class.text-green-600]="item.workplace.lockers"
                            [class.text-red-600]="!item.workplace.lockers"
                        >
                            {{ item.workplace.lockers ? 'done' : 'close' }}
                        </app-icon>
                    </div>
                    <div class="flex items-center p-2 space-x-2">
                        <div class="text-xs">Extenal Attendees Allowed</div>
                        <app-icon
                            class="text-2xl"
                            [class.text-green-600]="item.workplace.lockers"
                            [class.text-red-600]="!item.workplace.lockers"
                        >
                            {{ item.workplace.lockers ? 'done' : 'close' }}
                        </app-icon>
                    </div>
                    <div class="flex items-center p-2 space-x-2">
                        <div class="text-xs">Standalone Visitor Bookings</div>
                        <app-icon
                            class="text-2xl"
                            [class.text-green-600]="
                                item.workplace.standalone_visitors
                            "
                            [class.text-red-600]="
                                !item.workplace.standalone_visitors
                            "
                        >
                            {{
                                item.workplace.standalone_visitors
                                    ? 'done'
                                    : 'close'
                            }}
                        </app-icon>
                    </div>
                </div>
            </div>
            <div
                class="m-2 rounded bg-white flex-grow-1 dark:bg-neutral-700 border border-gray-300 dark:border-neutral-500"
            >
                <h3
                    class="w-full p-2 border-b border-gray-300 dark:border-neutral-500"
                >
                    Booking Panel
                </h3>
                <div class="flex flex-wrap max-w-[24rem]">
                    <div class="flex items-center p-2 space-x-2">
                        <div class="text-xs">Show title</div>
                        <app-icon
                            class="text-2xl"
                            [class.text-green-600]="
                                item.booking_panel.show_title
                            "
                            [class.text-red-600]="
                                !item.booking_panel.show_title
                            "
                        >
                            {{
                                item.booking_panel.show_title ? 'done' : 'close'
                            }}
                        </app-icon>
                    </div>
                    <div class="flex items-center p-2 space-x-2">
                        <div class="text-xs">Show host</div>
                        <app-icon
                            class="text-2xl"
                            [class.text-green-600]="
                                item.booking_panel.show_host
                            "
                            [class.text-red-600]="!item.booking_panel.show_host"
                        >
                            {{
                                item.booking_panel.show_host ? 'done' : 'close'
                            }}
                        </app-icon>
                    </div>
                    <div class="flex items-center p-2 space-x-2">
                        <div class="text-xs">Show room image</div>
                        <app-icon
                            class="text-2xl"
                            [class.text-green-600]="
                                item.booking_panel.show_images
                            "
                            [class.text-red-600]="
                                !item.booking_panel.show_images
                            "
                        >
                            {{
                                item.booking_panel.show_images
                                    ? 'done'
                                    : 'close'
                            }}
                        </app-icon>
                    </div>
                    <div class="flex items-center p-2 space-x-2">
                        <div class="text-xs">Show checkin QR</div>
                        <app-icon
                            class="text-2xl"
                            [class.text-green-600]="
                                item.booking_panel.show_qrcode
                            "
                            [class.text-red-600]="
                                !item.booking_panel.show_qrcode
                            "
                        >
                            {{
                                item.booking_panel.show_qrcode
                                    ? 'done'
                                    : 'close'
                            }}
                        </app-icon>
                    </div>
                </div>
            </div>
            <div
                class="m-2 rounded bg-white flex-grow-1 dark:bg-neutral-700 border border-gray-300 dark:border-neutral-500"
            >
                <h3
                    class="w-full p-2 border-b border-gray-300 dark:border-neutral-500"
                >
                    Concierge
                </h3>
                <div class="flex flex-wrap max-w-[24rem]">
                    <div class="flex items-center p-2 space-x-2">
                        <div class="text-xs">Match Workplace</div>
                        <app-icon
                            class="text-2xl"
                            [class.text-green-600]="
                                item.concierge.match_workplace
                            "
                            [class.text-red-600]="
                                !item.concierge.match_workplace
                            "
                        >
                            {{
                                item.concierge.match_workplace
                                    ? 'done'
                                    : 'close'
                            }}
                        </app-icon>
                    </div>
                </div>
            </div>
            <div
                class="m-2 rounded bg-white flex-grow-1 dark:bg-neutral-700 border border-gray-300 dark:border-neutral-500"
            >
                <h3
                    class="w-full p-2 border-b border-gray-300 dark:border-neutral-500"
                >
                    Visitor Kiosk
                </h3>
                <div class="flex flex-wrap max-w-[24rem]">
                    <div class="flex items-center p-2 space-x-2">
                        <div class="text-xs">Indution</div>
                        <app-icon
                            class="text-2xl"
                            [class.text-green-600]="
                                item.visitor_kiosk.induction
                            "
                            [class.text-red-600]="!item.visitor_kiosk.induction"
                        >
                            {{
                                item.visitor_kiosk.induction ? 'done' : 'close'
                            }}
                        </app-icon>
                    </div>
                    <div class="flex items-center p-2 space-x-2">
                        <div class="text-xs">Pre-order Catering</div>
                        <app-icon
                            class="text-2xl"
                            [class.text-green-600]="item.visitor_kiosk.catering"
                            [class.text-red-600]="!item.visitor_kiosk.catering"
                        >
                            {{ item.visitor_kiosk.catering ? 'done' : 'close' }}
                        </app-icon>
                    </div>
                </div>
            </div>
            <div
                class="m-2 rounded bg-white flex-grow-1 dark:bg-neutral-700 border border-gray-300 dark:border-neutral-500"
            >
                <h3
                    class="w-full p-2 border-b border-gray-300 dark:border-neutral-500"
                >
                    Map Kiosk
                </h3>
                <div class="flex flex-wrap max-w-[24rem]">
                    <div class="flex items-center p-2 space-x-2">
                        <div class="text-xs">Interactive</div>
                        <app-icon
                            class="text-2xl"
                            [class.text-green-600]="
                                item.map_kiosk.touch_enabled
                            "
                            [class.text-red-600]="!item.map_kiosk.touch_enabled"
                        >
                            {{
                                item.map_kiosk.touch_enabled ? 'done' : 'close'
                            }}
                        </app-icon>
                    </div>
                </div>
            </div>
            <div
                class="m-2 rounded bg-white flex-grow-1 dark:bg-neutral-700 border border-gray-300 dark:border-neutral-500"
            >
                <h3
                    class="w-full p-2 border-b border-gray-300 dark:border-neutral-500"
                >
                    Outlook Plugin
                </h3>
                <div class="flex flex-wrap max-w-[24rem]">
                    <div class="flex items-center p-2 space-x-2">
                        <div class="text-xs">Match Workplace</div>
                        <app-icon
                            class="text-2xl"
                            [class.text-green-600]="
                                item.outlook_plugin.match_workplace
                            "
                            [class.text-red-600]="
                                !item.outlook_plugin.match_workplace
                            "
                        >
                            {{
                                item.outlook_plugin.match_workplace
                                    ? 'done'
                                    : 'close'
                            }}
                        </app-icon>
                    </div>
                </div>
            </div>
        </main>
    `,
    styles: [``],
    imports: [MatIconButton, MatDialogClose, IconComponent],
})
export class InterfaceDetailsModalComponent {
    public readonly item = this._data;
    constructor(@Inject(MAT_DIALOG_DATA) private _data: Interface) {}
}
