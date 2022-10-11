import { Component, Input } from '@angular/core';
import {
    Building,
    OrganisationService,
} from '../organisation/organisation.service';
import { InterfaceSettings } from './interfaces.service';

@Component({
    selector: `interface-details`,
    template: `
        <div
            class="m-2 border border-gray-200 dark:border-neutral-500 p-4 rounded bg-white dark:bg-neutral-700 w-[300px] relative space-y-2"
            *ngIf="item"
        >
            <h3 class="text-lg">
                {{
                    building?.display_name ||
                        building?.name ||
                        '&lt;Default Settings&gt;'
                }}
            </h3>
            <h4 class="text-base font-medium">Workplace</h4>
            <div class="flex items-center space-x-2 ml-2" *ngFor="let opt of workplace_opts">
                <div class="text-sm">{{ opt[0] }}</div>
                <app-icon
                    [class.text-success]="item.workplace[opt[1]]"
                    [class.text-error]="!item.workplace[opt[1]]"
                >
                    {{ item.workplace[opt[1]] ? 'done' : 'close' }}
                </app-icon>
            </div>
            <div
                actions
                class="absolute top-1 right-1 rounded-3xl flex items-center bg-white dark:bg-neutral-700 shadow !p-0 min-w-0 border border-gray-200 dark:border-neutral-500"
            >
                <button mat-icon-button matTooltip="Edit Settings" (click)="edit()">
                    <app-icon>edit</app-icon>
                </button>
                <button
                    mat-icon-button
                    matTooltip="Delete Settings"
                    *ngIf="item?.id !== 'root'"
                    (click)="remove()"
                >
                    <app-icon>delete</app-icon>
                </button>
            </div>
        </div>
    `,
    styles: [
        `
            [actions] {
                opacity: 0;
                transition: opacity 200ms;
                pointer-events: none;
            }

            :host:hover [actions] {
                opacity: 1;
                pointer-events: auto;
            }
        `,
    ],
})
export class InterfaceDetailsComponent {
    @Input() public item: InterfaceSettings;

    public building: Building = null;
    public workplace_opts = [
        ['Room Booking', 'meetings'], 
        ['Room Booking', 'meetings'], 
        ['Room Booking', 'meetings'], 
        ['Room Booking', 'meetings'], 
        ['Room Booking', 'meetings'], 
        ['Room Booking', 'meetings'], 
        ['Room Booking', 'meetings']
    ];

    public readonly edit = () => null;
    public readonly remove = () => null;

    constructor(private _org: OrganisationService) {}
}
