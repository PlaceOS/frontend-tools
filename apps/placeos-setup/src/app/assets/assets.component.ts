import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { DataWarningComponent } from '../components/data-warning.component';
import { AssetDetailsComponent } from './asset-details.component';
import { AssetsService } from './assets.service';

@Component({
    selector: 'app-organisation',
    template: `
        <div class="relative flex h-full w-full flex-col overflow-hidden">
            <header class="space-x-2 bg-neutral-700 p-2">
                <button mat-button class="w-32" (click)="newAsset()">
                    Add Asset
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
                    @if (assets()?.length) {
                        @for (item of assets(); track item) {
                            <div asset-details [item]="item"></div>
                        }
                    } @else {
                        <div
                            class="flex h-full w-full items-center justify-center p-8"
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
    ],
})
export class AssetsComponent {
    private _service = inject(AssetsService);

    public readonly assets = this._service.assets;

    public readonly newAsset = () => this._service.openAssetModal();
    public readonly setSelected = (s) => this._service.setSelected('*', s);
    public readonly removeSelected = () => this._service.removeSelected();
    public readonly all_selected = computed(() => {
        const list = this._service.assets();
        const selected = this._service.selected();
        return list.length === selected.length && selected.length > 0;
    });
    public readonly some_selected = computed(() => {
        const list = this._service.assets();
        const selected = this._service.selected();
        return list.length !== selected.length && selected.length > 0;
    });
}
