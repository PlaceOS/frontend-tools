import { Component, Input } from '@angular/core';
import { Interface, InterfacesService } from './interfaces.service';

@Component({
    selector: `interface-details,[interface-details]`,
    template: `
        <div
            details
            class="flex items-center border-b border-neutral-500 text-sm hover:bg-black/10 relative"
        >
            <div thead class="min-w-0 w-10">
                <mat-checkbox></mat-checkbox>
            </div>
            <div thead class="font-mono text-xs">{{ item.id }}</div>
            <div thead class="w-48">{{ item.building_name }}</div>
            <div thead>
                <app-icon
                    [class.text-green-600]="has('workplace')"
                    [class.text-red-600]="!has('workplace')"
                >
                    {{ has('workplace') ? 'done' : 'close' }}
                </app-icon>
            </div>
            <div thead>
                <app-icon
                    [class.text-green-600]="has('concierge')"
                    [class.text-red-600]="!has('concierge')"
                >
                    {{ has('concierge') ? 'done' : 'close' }}
                </app-icon>
            </div>
            <div thead>
                <app-icon
                    [class.text-green-600]="has('booking-panel')"
                    [class.text-red-600]="!has('booking-panel')"
                >
                    {{ has('booking-panel') ? 'done' : 'close' }}
                </app-icon>
            </div>
            <div thead>
                <app-icon
                    [class.text-green-600]="has('visitor-kiosk')"
                    [class.text-red-600]="!has('visitor-kiosk')"
                >
                    {{ has('visitor-kiosk') ? 'done' : 'close' }}
                </app-icon>
            </div>
            <div thead>
                <app-icon
                    [class.text-green-600]="has('map-kiosk')"
                    [class.text-red-600]="!has('map-kiosk')"
                >
                    {{ has('map-kiosk') ? 'done' : 'close' }}
                </app-icon>
            </div>
            <div thead>
                <app-icon
                    [class.text-green-600]="has('outlook-plugin')"
                    [class.text-red-600]="!has('outlook-plugin')"
                >
                    {{ has('outlook-plugin') ? 'done' : 'close' }}
                </app-icon>
            </div>
            <div
                actions
                class="absolute top-1/2 -translate-y-1/2 left-12 rounded-3xl flex items-center bg-white dark:bg-neutral-700 shadow !p-0 min-w-0 w-auto"
            >
                <button
                    mat-icon-button
                    matTooltip="View Interface Settings"
                    (click)="view()"
                >
                    <app-icon>info</app-icon>
                </button>
                <button
                    mat-icon-button
                    matTooltip="Edit Interface"
                    (click)="edit()"
                >
                    <app-icon>edit</app-icon>
                </button>
                <button
                    mat-icon-button
                    matTooltip="Delete Interface"
                    (click)="remove()"
                >
                    <app-icon>delete</app-icon>
                </button>
            </div>
        </div>
    `,
    styles: [
        `
            :host {
                min-width: 100%;
            }

            [details] > div {
                min-width: 8rem;
                width: 8rem;
                padding: 1rem;
                flex-shrink: 0;
            }

            [actions] {
                opacity: 0;
                transition: opacity 200ms;
                pointer-events: none;
            }

            [details]:hover [actions] {
                opacity: 1;
                pointer-events: auto;
            }

            app-icon {
                font-size: 1.5rem;
            }
        `,
    ],
})
export class InterfaceDetailsComponent {
    @Input() public item: Interface;

    public readonly view = () => this._service.openInterfaceDetailsModal(this.item);
    public readonly edit = () => this._service.openInterfaceModal(this.item);
    public readonly remove = () => this._service.removeInterface(this.item);

    public has(id: string) {
        return this.item?.required.includes(id);
    }

    constructor(private _service: InterfacesService) {}
}
