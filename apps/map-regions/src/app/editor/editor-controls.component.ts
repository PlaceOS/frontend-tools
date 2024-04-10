import { Component } from '@angular/core';
import { EditorStateService } from './editor-state.service';

@Component({
    selector: 'editor-controls',
    template: `
        <div
            class="flex flex-col items-center bg-base-100 border border-base-300 rounded overflow-hidden shadow"
        >
            <button
                icon
                matRipple
                class="rounded"
                [class.bg-primary]="action === 'rect'"
                [class.text-white]="action === 'rect'"
                matTooltip="Draw Rectangle"
                matTooltipPosition="right"
                (click)="setAction('rect')"
            >
                <app-icon>aspect_ratio</app-icon>
            </button>
            <button
                icon
                matRipple
                class="rounded"
                [class.bg-primary]="action === 'add_points'"
                [class.text-white]="action === 'add_points'"
                matTooltip="Add Points"
                matTooltipPosition="right"
                (click)="setAction('add_points')"
            >
                <app-icon>add_circle</app-icon>
            </button>
            <button
                icon
                matRipple
                class="rounded"
                [class.bg-primary]="action === 'remove_points'"
                [class.text-white]="action === 'remove_points'"
                matTooltip="Remove Points"
                matTooltipPosition="right"
                (click)="setAction('remove_points')"
            >
                <app-icon>remove_circle</app-icon>
            </button>
        </div>
    `,
    styles: [
        `
            button {
                border-radius: 0;
            }
        `,
    ],
})
export class EditorControlsComponent {
    public get action() {
        return this._state.action;
    }

    public readonly setAction = (a) => this._state.setAction(a);

    constructor(private _state: EditorStateService) {}
}
