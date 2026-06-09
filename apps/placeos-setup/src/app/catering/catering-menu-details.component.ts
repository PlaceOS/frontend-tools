import {
    Component,
    computed,
    inject,
    input,
    signal,
    SimpleChanges,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatTooltip } from '@angular/material/tooltip';
import { IconComponent } from '../../../../../libs/components/src/lib/icon.component';
import {
    CateringMenuConfig,
    CateringStateService,
} from './catering-state.service';

@Component({
    selector: `catering-menu-details,[catering-menu-details]`,
    template: `
        <div
            details
            class="relative flex items-center border-b border-neutral-500 text-sm hover:bg-black/10"
        >
            <div thead class="w-10 min-w-0">
                <mat-checkbox />
            </div>
            <div thead>{{ item().name }}</div>
            <div thead>{{ item_count() }}</div>
            <div
                actions
                class="absolute top-1/2 left-12 flex w-auto min-w-0 -translate-y-1/2 items-center rounded-3xl bg-white !p-0 shadow dark:bg-neutral-700"
            >
                <button mat-icon-button matTooltip="Edit Menu" (click)="edit()">
                    <app-icon>edit</app-icon>
                </button>
                <button
                    mat-icon-button
                    matTooltip="Clear Menu"
                    (click)="remove()"
                >
                    <app-icon>delete_sweep</app-icon>
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
                min-width: 12rem;
                width: 12rem;
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
        `,
    ],
    imports: [MatCheckbox, MatIconButton, MatTooltip, IconComponent],
})
export class CateringMenuDetailsComponent {
    private _service = inject(CateringStateService);

    public readonly item = input<CateringMenuConfig>(undefined);

    private _id = signal('');

    public readonly item_count = computed(
        () => this._service.menuForID(this._id())?.length || 0,
    );

    public readonly edit = () => this._service.openMenuModal(this.item());
    public readonly remove = () => this._service.removeMenu(this.item());

    public ngOnChange(changes: SimpleChanges) {
        if (changes.item) {
            this._id.set(this.item()?.id || '');
        }
    }
}
