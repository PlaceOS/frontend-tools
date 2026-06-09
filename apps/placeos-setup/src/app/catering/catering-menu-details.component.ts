import { Component, Input, SimpleChanges } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    CateringMenuConfig,
    CateringStateService,
} from './catering-state.service';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { IconComponent } from '../../../../../libs/components/src/lib/icon.component';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: `catering-menu-details,[catering-menu-details]`,
    template: `
        <div
            details
            class="flex items-center border-b border-neutral-500 text-sm hover:bg-black/10 relative"
        >
            <div thead class="min-w-0 w-10">
                <mat-checkbox></mat-checkbox>
            </div>
            <div thead>{{ item.name }}</div>
            <div thead>{{ item_count | async }}</div>
            <div
                actions
                class="absolute top-1/2 -translate-y-1/2 left-12 rounded-3xl flex items-center bg-white dark:bg-neutral-700 shadow !p-0 min-w-0 w-auto"
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
    imports: [MatCheckbox, MatIconButton, MatTooltip, IconComponent, AsyncPipe],
})
export class CateringMenuDetailsComponent {
    @Input() public item: CateringMenuConfig;

    private _id = new BehaviorSubject('');

    public readonly item_count = combineLatest([
        this._id,
        this._service.menu_list,
    ]).pipe(map(([id, _]) => this._service.menuForID(id)?.length || 0));

    public readonly edit = () => this._service.openMenuModal(this.item);
    public readonly remove = () => this._service.removeMenu(this.item);

    constructor(private _service: CateringStateService) {}

    public ngOnChange(changes: SimpleChanges) {
        if (changes.item) {
            this._id.next(this.item?.id || '');
        }
    }
}
