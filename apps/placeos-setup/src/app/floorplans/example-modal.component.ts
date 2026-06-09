import { Component } from '@angular/core';

@Component({
    standalone: false,
    selector: 'example-floorplan-modal',
    template: `
        <div
            class="relative max-w-[80vw] max-h-[80vh] bg-white dark:bg-neutral-700 overflow-hidden rounded p-10"
        >
            <button mat-icon-button mat-dialog-close class="absolute top-1 left-1 bg-black/30 text-white">
                <app-icon>close</app-icon>
            </button>
            <img class="object-fit" src="assets/example-floorplan.png" />
        </div>
    `,
    styles: [``],

})
export class FloorPlanExampleModalComponent {}
