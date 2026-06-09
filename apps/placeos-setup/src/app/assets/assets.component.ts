import { Component, inject } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AssetsService } from './assets.service';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { AssetDetailsComponent } from './asset-details.component';
import { DataWarningComponent } from '../components/data-warning.component';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-organisation',
    template: `
        <div class="flex flex-col h-full w-full overflow-hidden relative">
            <header class="bg-neutral-700 p-2 space-x-2">
                <button mat-button class="w-32" (click)="newAsset()">
                    Add Asset
                </button>
                @if ((all_selected | async) || (some_selected | async)) {
                <button mat-button class="w-48" (click)="removeSelected()">
                    Remove Selected
                </button>
                }
            </header>
            <main class="w-full h-1/2 flex-1 overflow-auto">
                <div table>
                    <div
                        class="sticky top-0 flex items-center bg-neutral-800 border-b border-neutral-500 w-full"
                    >
                        <div thead class="min-w-0 w-10">
                            <mat-checkbox [ngModel]="all_selected | async"
                                [indeterminate]="some_selected | async"
                                (ngModelChange)="setSelected($event)"
                             />
                        </div>
                        <div thead>Name</div>
                        <div thead>Building</div>
                        <div thead>Brand</div>
                        <div thead>Category</div>
                        <div thead>Barcode</div>
                        <div thead>Purchase Date</div>
                        <div thead>Good Until</div>
                        <div thead>Consumable?</div>
                        <div thead>Number Available</div>
                        <div thead>Send Return Reminders?</div>
                        <div thead>Reminder Delay</div>
                        <div thead>Available for Desks?</div>
                        <div thead>Available for Spaces?</div>
                    </div>
                    @if ((assets | async)?.length) { @for (item of assets |
                    async; track item) {
                    <div asset-details [item]="item"></div>
                    } } @else {
                    <div
                        class="w-full h-full flex items-center justify-center p-8"
                    >
                        <p class="opacity-60">
                            No assets setup for organisation
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
                width: 108rem;
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
        AssetDetailsComponent,
        DataWarningComponent,
        AsyncPipe,
    ],
})
export class AssetsComponent {
    private _service = inject(AssetsService);

    public readonly assets = this._service.assets;

    public readonly newAsset = () => this._service.openAssetModal();
    public readonly setSelected = (s) => this._service.setSelected('*', s);
    public readonly removeSelected = () => this._service.removeSelected();
    public readonly all_selected = combineLatest([
        this._service.assets,
        this._service.selected,
    ]).pipe(map(([l, s]) => l.length === s.length && s.length > 0));
    public readonly some_selected = combineLatest([
        this._service.assets,
        this._service.selected,
    ]).pipe(map(([l, s]) => l.length !== s.length && s.length > 0));
}
