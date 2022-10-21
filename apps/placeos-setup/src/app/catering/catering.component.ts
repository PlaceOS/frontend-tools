import { Component } from '@angular/core';
import { OrganisationService } from '../organisation/organisation.service';
import { CateringStateService } from './catering-state.service';

@Component({
    selector: 'app-catering',
    template: `
        <div class="flex flex-col h-full w-full overflow-hidden">
            <header class="bg-neutral-700 p-2 space-x-2 h-14">
            </header>
            <main class="w-full h-1/2 flex-1 overflow-auto">
                <div table>
                    <div
                        class="sticky top-0 flex items-center bg-neutral-800 border-b border-neutral-500 w-full"
                    >
                        <div thead class="min-w-0 w-10">
                            <mat-checkbox></mat-checkbox>
                        </div>
                        <div thead>Name</div>
                        <div thead>Building</div>
                    </div>
                    <ng-container
                        *ngIf="(menu_list | async)?.length; else empty_state"
                    >
                        <div
                            catering-menu-details
                            *ngFor="let item of menu_list | async"
                            [item]="item"
                        ></div>
                    </ng-container>
                </div>
            </main>
        </div>
        <ng-template #empty_state>
            <div class="w-full h-full flex items-center justify-center p-8">
                <p class="opacity-60">No buildings setup for organisation</p>
            </div>
        </ng-template>
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
})
export class CateringComponent {
    public readonly menu_list = this._service.menu_list;

    constructor(private _service: CateringStateService, private _org: OrganisationService) {}
}
