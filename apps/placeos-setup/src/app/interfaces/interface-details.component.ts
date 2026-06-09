import { Component, computed, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatTooltip } from '@angular/material/tooltip';
import { IconComponent } from '../../../../../libs/components/src/lib/icon.component';
import { Interface, InterfacesService } from './interfaces.service';

@Component({
    selector: `interface-details,[interface-details]`,
    template: `
        <div
            details
            class="relative flex items-center border-b border-neutral-500 text-sm hover:bg-black/10"
        >
            <div thead class="w-10 min-w-0">
                <mat-checkbox
                    [ngModel]="selected()"
                    (ngModelChange)="setSelected($event)"
                />
            </div>
            <div thead class="font-mono text-xs">{{ item().id }}</div>
            <div thead class="w-48">{{ item().building_name }}</div>
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
                class="absolute top-1/2 left-12 flex w-auto min-w-0 -translate-y-1/2 items-center rounded-3xl bg-white !p-0 shadow dark:bg-neutral-700"
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
    imports: [
        MatCheckbox,
        FormsModule,
        IconComponent,
        MatIconButton,
        MatTooltip,
    ],
})
export class InterfaceDetailsComponent {
    private _service = inject(InterfacesService);

    public readonly item = input<Interface>(undefined);

    public readonly view = () =>
        this._service.openInterfaceDetailsModal(this.item());
    public readonly edit = () => this._service.openInterfaceModal(this.item());
    public readonly remove = () => this._service.removeInterface(this.item());
    public readonly setSelected = (s) =>
        this._service.setSelected(this.item().id, s);

    public readonly selected = computed(() => {
        return this._service.isSelected(this.item().id);
    });

    public has(id: string) {
        return this.item()?.required.includes(id);
    }
}
