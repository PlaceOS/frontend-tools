import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { RouterLink } from '@angular/router';
import { DataWarningComponent } from '../components/data-warning.component';
import { OrganisationService } from '../organisation/organisation.service';
import { CateringMenuDetailsComponent } from './catering-menu-details.component';
import { CateringStateService } from './catering-state.service';

@Component({
    selector: 'app-catering',
    template: `
        <div class="relative flex h-full w-full flex-col overflow-hidden">
            <header class="h-14 space-x-2 bg-neutral-700 p-2">
                <a
                    button
                    mat-button
                    [routerLink]="['/organisation']"
                    [queryParams]="{ add: 'building' }"
                >
                    Add Building
                </a>
            </header>
            <main class="h-1/2 w-full flex-1 overflow-auto">
                <div table>
                    <div
                        class="sticky top-0 flex w-full items-center border-b border-neutral-500 bg-neutral-800"
                    >
                        <div thead class="w-10 min-w-0">
                            <mat-checkbox />
                        </div>
                        <div thead>Building</div>
                        <div thead>Item Count</div>
                    </div>
                    @if (menu_list()?.length) {
                        @for (item of menu_list(); track item) {
                            <div catering-menu-details [item]="item"></div>
                        }
                    } @else {
                        <div
                            class="flex h-full w-full items-center justify-center p-8"
                        >
                            <p class="opacity-60">
                                No buildings setup for organisation
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
                min-width: 12rem;
                width: 12rem;
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
        RouterLink,
        MatCheckbox,
        CateringMenuDetailsComponent,
        DataWarningComponent,
    ],
})
export class CateringComponent {
    private _service = inject(CateringStateService);
    private _org = inject(OrganisationService);

    public readonly menu_list = this._service.menu_list;
}
