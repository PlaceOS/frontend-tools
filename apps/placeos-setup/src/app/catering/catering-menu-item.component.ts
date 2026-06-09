import { Component, inject, input, signal } from '@angular/core';

import { CateringItem } from './catering-item.class';
import { CateringStateService } from './catering-state.service';
import { CateringOption } from './catering.interfaces';
import { MatIconButton } from '@angular/material/button';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { IconComponent } from '../../../../../libs/components/src/lib/icon.component';
import { AsyncPipe, CurrencyPipe } from '@angular/common';

@Component({
    selector: '[catering-menu-item]',
    template: `
        <div
            class="w-full h-full bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-500 overflow-hidden rounded"
        >
            @if (item()) {
            <div item class="flex items-center px-2">
                <div class="flex items-center p-2 flex-1">
                    <div class="flex-1">
                        <div>{{ item().name }}</div>
                        <div class="text-xs opacity-60">
                            {{ item().category }}
                        </div>
                    </div>
                    <div
                        class="p-2 m-2 text-xs font-bold text-white rounded bg-primary"
                    >
                        {{
                            item().unit_price / 100 | currency: (symbol | async)
                        }}
                    </div>
                </div>
                <button mat-icon-button [matMenuTriggerFor]="menu">
                    <app-icon>more_vert</app-icon>
                </button>
                <button
                    mat-icon-button
                    [disabled]="!item().options.length"
                    (click)="show_options.update((show) => !show)"
                >
                    <app-icon>expand_more</app-icon>
                </button>
            </div>
            } @if (item()) {
            <div
                options
                class="bg-gray-100 dark:bg-neutral-700 overflow-hidden"
                [style.height]="
                    show_options() ? item().options.length * 3.5 + 'rem' : '0'
                "
            >
                @for (option of item().options; track option) {
                <div
                    class="flex p-2 items-center border-t border-solid border-gray-300 dark:border-neutral-500 relative"
                >
                    <div
                        class="absolute inset-y-0 left-0 w-2 bg-gray-400 dark:bg-neutral-600"
                    ></div>
                    <div class="flex-1 pl-4 pr-2">
                        <div class="text">{{ option.name }}</div>
                        <div class="text-xs opacity-60">
                            {{ option.group }}
                        </div>
                    </div>
                    <button
                        edit
                        mat-icon-button
                        class="mx-2"
                        (click)="editOption(option)"
                    >
                        <app-icon>edit</app-icon>
                    </button>
                    <button
                        remove
                        mat-icon-button
                        class="mx-2"
                        (click)="removeOption(option)"
                    >
                        <app-icon>delete</app-icon>
                    </button>
                </div>
                }
            </div>
            }
            <mat-menu #menu="matMenu">
                <button
                    mat-menu-item
                    class="flex items-center"
                    (click)="addOption()"
                >
                    <app-icon>add</app-icon>
                    <div class="ml-2">Add Option</div>
                </button>
                <button
                    mat-menu-item
                    class="flex items-center"
                    (click)="editItem()"
                >
                    <app-icon>edit</app-icon>
                    <div class="ml-2">Edit Item</div>
                </button>
                <button
                    mat-menu-item
                    class="flex items-center"
                    (click)="removeItem()"
                >
                    <app-icon>delete</app-icon>
                    <div class="ml-2">Remove Item</div>
                </button>
            </mat-menu>
        </div>
    `,
    styles: [
        `
            :host {
                overflow: hidden;
                width: 768px;
                margin: 0.5rem auto;
                max-width: calc(100vw - 1rem);
            }

            button[mat-menu-item] {
                display: flex;
            }

            [options] {
                transition: height 200ms;
            }
        `,
    ],
    imports: [
        MatIconButton,
        MatMenuTrigger,
        IconComponent,
        MatMenu,
        MatMenuItem,
        AsyncPipe,
        CurrencyPipe,
    ],
})
export class CateringMenuItemComponent {
    private _catering = inject(CateringStateService);

    /** Item to display */
    public readonly item = input.required<CateringItem>();
    /** Whether to show item options */
    public readonly show_options = signal(false);

    public readonly addOption = () => this._catering.addOption(this.item());

    public readonly editOption = (option: CateringOption) =>
        this._catering.addOption(this.item(), option);

    public readonly removeOption = (option: CateringOption) =>
        this._catering.deleteOption(this.item(), option);

    public readonly editItem = () => this._catering.addItem(this.item());

    public readonly removeItem = () => this._catering.deleteItem(this.item());

    /** Currency symbol for active menu */
    public get symbol() {
        return this._catering.currency;
    }
}
