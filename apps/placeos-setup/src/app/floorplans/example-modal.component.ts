import { Component } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDialogClose } from '@angular/material/dialog';
import { IconComponent } from '../../../../../libs/components/src/lib/icon.component';

@Component({
    selector: 'example-floorplan-modal',
    template: `
        <div
            class="relative max-h-[80vh] max-w-[80vw] overflow-hidden rounded bg-white p-10 dark:bg-neutral-700"
        >
            <button
                mat-icon-button
                mat-dialog-close
                class="absolute top-1 left-1 bg-black/30 text-white"
            >
                <app-icon>close</app-icon>
            </button>
            <img class="object-fit" src="assets/example-floorplan.png" />
        </div>
    `,
    styles: [``],
    imports: [MatIconButton, MatDialogClose, IconComponent],
})
export class FloorPlanExampleModalComponent {}
