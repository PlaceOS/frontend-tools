import { Component, computed, inject, output, signal } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';

import { MatButton, MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { IconComponent } from '../../../../../libs/components/src/lib/icon.component';
import { CateringMenuComponent } from './catering-menu.component';
import { CateringMenuConfig } from './catering-state.service';

@Component({
    selector: 'catering-menu-modal',
    template: `
        <div
            class="absolute inset-0 flex flex-col bg-white dark:bg-neutral-600 dark:text-white"
        >
            <header
                class="w-full border-b border-gray-200 bg-blue-300 dark:border-neutral-500 dark:bg-neutral-700"
            >
                <div class="relative mx-auto w-[640px] p-4 text-center">
                    <div class="font-medium">
                        Edit Catering Menu for {{ building() }}
                    </div>
                    @if (!loading()) {
                        <button
                            mat-icon-button
                            mat-dialog-close
                            class="absolute top-1/2 right-0 -translate-y-1/2"
                        >
                            <app-icon>close</app-icon>
                        </button>
                    }
                </div>
            </header>
            @if (!loading()) {
                <main
                    class="relative mx-auto h-1/2 w-[768px] max-w-full flex-1"
                >
                    <catering-menu />
                    <button
                        mat-icon-button
                        class="bg-primary absolute right-2 bottom-2 shadow"
                        matTooltip="Add Item to Menu"
                        (click)="add.emit()"
                    >
                        <app-icon>add</app-icon>
                    </button>
                </main>
                <footer
                    class="w-full border-t border-gray-200 bg-blue-300 dark:border-neutral-500 dark:bg-neutral-700"
                >
                    <div class="relative mx-auto w-[640px] p-4">
                        <button mat-button (click)="save()" class="w-32">
                            Save
                        </button>
                    </div>
                </footer>
            } @else {
                <div class="mx-auto h-1/2 w-[640px] flex-1 p-4">
                    <mat-spinner />
                    <p>Saving catering menu data...</p>
                </div>
            }
        </div>
    `,
    styles: [``],
    imports: [
        MatIconButton,
        MatDialogClose,
        IconComponent,
        CateringMenuComponent,
        MatTooltip,
        MatButton,
    ],
})
export class CateringMenuModalComponent {
    private readonly _data = signal(
        inject<CateringMenuConfig>(MAT_DIALOG_DATA),
    );

    public readonly add = output();
    public readonly loading = signal(false);

    public readonly building = computed(() => this._data().name);
}
