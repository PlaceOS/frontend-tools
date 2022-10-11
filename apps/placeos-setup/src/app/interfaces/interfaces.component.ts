import { Component } from '@angular/core';
import { InterfacesService } from './interfaces.service';

@Component({
    selector: 'app-interfaces',
    template: `
        <div class="flex flex-col h-full w-full overflow-hidden">
            <header class="bg-neutral-700 p-2 space-x-2">
                <button mat-button class="w-48" (click)="newConfig()">
                    Add Custom Settings
                </button>
            </header>
            <main class="w-full h-1/2 flex-1 overflow-auto">
                <div
                    class="flex flex-wrap items-center mx-auto w-[640px] max-w-full"
                >
                    <ng-container
                        *ngIf="(items | async)?.length; else empty_state"
                    >
                        <interface-details
                            *ngFor="let item of items | async"
                            [item]="item"
                        ></interface-details>
                    </ng-container>
                </div>
            </main>
        </div>
        <ng-template #empty_state>
            <div class="w-full h-full flex items-center justify-center p-8">
                <p class="opacity-60">No interface settings for organisation</p>
            </div>
        </ng-template>
    `,
    styles: [``],
})
export class InterfacesComponent {
    public readonly items = this._service.interfaces;

    public readonly newConfig = () => null;

    constructor(private _service: InterfacesService) {}
}
