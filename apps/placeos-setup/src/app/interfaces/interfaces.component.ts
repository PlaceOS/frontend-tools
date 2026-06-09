import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { DataWarningComponent } from '../components/data-warning.component';
import { InterfaceDetailsComponent } from './interface-details.component';
import { InterfacesService } from './interfaces.service';

@Component({
    selector: 'app-interfaces',
    template: `
        <div class="relative flex h-full w-full flex-col overflow-hidden">
            <header class="space-x-2 bg-neutral-700 p-2">
                <button mat-button class="w-64" (click)="newInterface()">
                    Add Custom Interface Config
                </button>
                @if (all_selected() || some_selected()) {
                    <button mat-button class="w-48" (click)="removeSelected()">
                        Remove Selected
                    </button>
                }
            </header>
            <main class="h-1/2 w-full flex-1 overflow-auto">
                <div table>
                    <div
                        class="sticky top-0 flex w-full items-center border-b border-neutral-500 bg-neutral-800"
                    >
                        <div thead class="w-10 min-w-0">
                            <mat-checkbox
                                [ngModel]="all_selected()"
                                [indeterminate]="some_selected()"
                                (ngModelChange)="setSelected($event)"
                            />
                        </div>
                        <div thead>Interface ID</div>
                        <div thead class="w-48">Building</div>
                        <div thead>Workplace App</div>
                        <div thead>Concierge App</div>
                        <div thead>Booking Panel</div>
                        <div thead>Visitor Kiosk</div>
                        <div thead>Map Kiosk</div>
                        <div thead>Outlook Plugin</div>
                    </div>
                    @if (interfaces()?.length) {
                        @for (item of interfaces(); track item) {
                            <div interface-details [item]="item"></div>
                        }
                    } @else {
                        <div
                            class="flex h-full w-full items-center justify-center p-8"
                        >
                            <p class="opacity-60">
                                No interface settings for organisation
                            </p>
                        </div>
                    }
                </div>
            </main>
            <data-warning />
        </div>
    `,
    styles: [
        `
            [table] {
                width: 72rem;
            }

            [thead] {
                min-width: 8rem;
                width: 8rem;
                padding: 1rem;
                font-weight: 500;
                flex-shrink: 0;
            }

            [org-building]:nth-child(2n) {
                background-color: #00000008;
            }
        `,
    ],
    imports: [
        MatButton,
        MatCheckbox,
        FormsModule,
        InterfaceDetailsComponent,
        DataWarningComponent,
    ],
})
export class InterfacesComponent {
    private _service = inject(InterfacesService);

    public readonly interfaces = this._service.interfaces;

    public readonly newInterface = () => this._service.openInterfaceModal();
    public readonly setSelected = (s) => this._service.setSelected('*', s);
    public readonly removeSelected = () => this._service.removeSelected();
    public readonly all_selected = computed(() => {
        const list = this._service.interfaces();
        const selected = this._service.selected();
        return list.length === selected.length && selected.length > 0;
    });
    public readonly some_selected = computed(() => {
        const list = this._service.interfaces();
        const selected = this._service.selected();
        return list.length !== selected.length && selected.length > 0;
    });
}
