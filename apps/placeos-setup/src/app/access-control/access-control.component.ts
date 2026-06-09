import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { DataWarningComponent } from '../components/data-warning.component';
import { AccessControlDetailsComponent } from './access-control-details.component';
import { AccessControlService } from './access-control.service';

@Component({
    selector: 'app-organisation',
    template: `
        <div class="relative flex h-full w-full flex-col overflow-hidden">
            <header class="space-x-2 bg-neutral-700 p-2">
                <button mat-button class="w-48" (click)="newAccessControl()">
                    Add Access Control
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
                        <div thead>Type</div>
                        <div thead>Building</div>
                        <div thead>Managed Onsite?</div>
                        <div thead>Isolated?</div>
                        <div thead>Linked to Staff?</div>
                        <div thead>Staff Linked to Passes?</div>
                    </div>
                    @if (access_controls()?.length) {
                        @for (item of access_controls(); track item) {
                            <div access-control-details [item]="item"></div>
                        }
                    } @else {
                        <div
                            class="flex h-full w-full items-center justify-center p-8"
                        >
                            <p class="opacity-60">
                                No access control setup for organisation
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
                width: 64rem;
            }

            [thead] {
                min-width: 10rem;
                width: 10rem;
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
        AccessControlDetailsComponent,
        DataWarningComponent,
    ],
})
export class AccessControlsComponent {
    private _service = inject(AccessControlService);

    public readonly access_controls = this._service.access_controls;

    public readonly newAccessControl = () =>
        this._service.openAccessControlModal();
    public readonly setSelected = (s) => this._service.setSelected('*', s);
    public readonly removeSelected = () => this._service.removeSelected();
    public readonly all_selected = computed(() => {
        const list = this._service.access_controls();
        const selected = this._service.selected();
        return list.length === selected.length && selected.length > 0;
    });
    public readonly some_selected = computed(() => {
        const list = this._service.access_controls();
        const selected = this._service.selected();
        return list.length !== selected.length && selected.length > 0;
    });
}
