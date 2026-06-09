import { Component } from '@angular/core';
import { OrganisationService } from '../organisation/organisation.service';
import { CateringStateService } from './catering-state.service';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatCheckbox } from '@angular/material/checkbox';
import { CateringMenuDetailsComponent } from './catering-menu-details.component';
import { DataWarningComponent } from '../components/data-warning.component';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-catering',
    template: `
        <div class="flex flex-col h-full w-full overflow-hidden relative">
            <header class="bg-neutral-700 p-2 space-x-2 h-14">
                <a
                    button
                    mat-button
                    [routerLink]="['/organisation']"
                    [queryParams]="{ add: 'building' }"
                >
                    Add Building
                </a>
            </header>
            <main class="w-full h-1/2 flex-1 overflow-auto">
                <div table>
                    <div
                        class="sticky top-0 flex items-center bg-neutral-800 border-b border-neutral-500 w-full"
                    >
                        <div thead class="min-w-0 w-10">
                            <mat-checkbox></mat-checkbox>
                        </div>
                        <div thead>Building</div>
                        <div thead>Item Count</div>
                    </div>
                    @if ((menu_list | async)?.length) { @for (item of menu_list
                    | async; track item) {
                    <div catering-menu-details [item]="item"></div>
                    } } @else {
                    <div
                        class="w-full h-full flex items-center justify-center p-8"
                    >
                        <p class="opacity-60">
                            No buildings setup for organisation
                        </p>
                    </div>
                    }
                </div>
            </main>
            <data-warning></data-warning>
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
        AsyncPipe,
    ],
})
export class CateringComponent {
    public readonly menu_list = this._service.menu_list;

    constructor(
        private _service: CateringStateService,
        private _org: OrganisationService
    ) {}
}
