import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CateringMenuConfig } from './catering-state.service';

@Component({
    selector: 'catering-menu-modal',
    template: `
        <div
            class="absolute inset-0 bg-white dark:bg-neutral-600 dark:text-white flex flex-col"
        >
            <header
                class="w-full bg-blue-300 dark:bg-neutral-700 border-b border-gray-200 dark:border-neutral-500"
            >
                <div class="mx-auto w-[640px] relative p-4 text-center">
                    <div class="font-medium">
                        Edit Catering Menu for {{ building }}
                    </div>
                    <button
                        mat-icon-button
                        mat-dialog-close
                        class="absolute top-1/2 right-0 -translate-y-1/2"
                        *ngIf="!loading"
                    >
                        <app-icon>close</app-icon>
                    </button>
                </div>
            </header>
            <ng-container *ngIf="!loading; else load_state">
                <main
                    class="mx-auto w-[768px] max-w-full flex-1 h-1/2 relative"
                >
                    <catering-menu></catering-menu>
                    <button
                        mat-icon-button
                        class="absolute bottom-2 right-2 bg-primary shadow"
                        matTooltip="Add Item to Menu"
                        (click)="add.emit()"
                    >
                        <app-icon>add</app-icon>
                    </button>
                </main>
                <footer
                    class="w-full bg-blue-300 dark:bg-neutral-700 border-t border-gray-200 dark:border-neutral-500"
                >
                    <div class="mx-auto w-[640px] relative p-4">
                        <button mat-button (click)="save()" class="w-32">
                            Save
                        </button>
                    </div>
                </footer>
            </ng-container>
        </div>
        <ng-template #load_state>
            <div class="mx-auto w-[640px] p-4 flex-1 h-1/2">
                <mat-spinner></mat-spinner>
                <p>Saving catering menu data...</p>
            </div>
        </ng-template>
    `,
    styles: [``],
})
export class CateringMenuModalComponent {
    @Output() public add = new EventEmitter();
    public loading = false;

    public readonly building = this._data.name;

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private _data: CateringMenuConfig
    ) {}
}
