import { Component, Output, EventEmitter, Inject } from '@angular/core';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatDialogClose,
} from '@angular/material/dialog';
import { openGenericModal } from '@placeos-tools/common';

import { ApplicationIcon, DialogEvent } from 'libs/common/src/lib/types';
import { IconComponent } from './icon.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButton } from '@angular/material/button';

export async function openConfirmModal(
    data: ConfirmModalData,
    dialog: MatDialog
) {
    return openGenericModal(
        ConfirmModalComponent,
        data,
        dialog,
        CONFIRM_METADATA as any
    );
}

export interface ConfirmModalData {
    /** Title of the modal */
    title: string;
    /** Contents of the modal */
    content: string;
    /** Text displaed on the confirmation button */
    confirm_text?: string;
    /** Text displaed on the confirmation button */
    cancel_text?: string;
    /** Icon to display on the modal */
    icon: ApplicationIcon;
}

export const CONFIRM_METADATA = {
    height: 'auto',
    width: '24em',
    maxHeight: 'calc(100vh - 2em)',
    maxWidth: 'calc(100vw - 2em)',
};

@Component({
    selector: 'confirm-modal',
    template: `
        <header class="p-4 border-b border-gray-200 dark:border-neutral-500">
            <h3 class="font-medium">{{ title }}</h3>
        </header>
        @if (!loading) {
        <main class="flex flex-col items-center space-y-2 p-4">
            <app-icon [icon]="icon" class="text-5xl"></app-icon>
            <p
                content
                class="text-center text-sm w-[22rem]"
                [innerHTML]="content"
            ></p>
        </main>
        } @else {
        <main loading>
            <div
                class="w-full h-48 flex flex-col items-center justify-center space-y-2"
            >
                <mat-spinner diameter="32"></mat-spinner>
                <p>{{ loading }}</p>
            </div>
        </main>
        } @if (!loading) {
        <footer class="flex items-center justify-center p-2 space-x-2">
            <button mat-button class="inverse w-32" mat-dialog-close>
                {{ cancel_text }}
            </button>
            <button mat-button name="accept" class="w-32" (click)="onConfirm()">
                {{ confirm_text }}
            </button>
        </footer>
        }
    `,
    styles: [``],
    imports: [IconComponent, MatProgressSpinner, MatButton, MatDialogClose],
})
export class ConfirmModalComponent {
    /** Loading state */
    public loading: string;
    /** Emitter for user action on the modal */
    @Output() public event = new EventEmitter<DialogEvent>();
    /** Title of the confirm modal */
    public readonly title: string = this._data.title || 'Confirm';
    /** Body of the confirm modal */
    public readonly content: string = this._data.content || 'Are you sure?';
    /** Display text on the confirm button */
    public readonly confirm_text: string = this._data.confirm_text || 'Accept';
    /** Display text on the cancel button */
    public readonly cancel_text: string = this._data.cancel_text || 'Cancel';
    /** Display icon properties */
    public readonly icon: ApplicationIcon = this._data.icon || {
        class: 'material-icons',
        content: 'done',
    };
    /** Prevent user from closing the modal */
    public readonly disableClose = () => (this._dialog_ref.disableClose = true);
    /** Allow the user to close the modal */
    public readonly enableClose = () => (this._dialog_ref.disableClose = false);

    constructor(
        private _dialog_ref: MatDialogRef<ConfirmModalComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: ConfirmModalData
    ) {}

    /** User confirmation of the content of the modal */
    public onConfirm() {
        this.event.emit({ reason: 'done' });
    }
}
