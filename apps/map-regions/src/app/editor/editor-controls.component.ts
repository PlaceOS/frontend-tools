import { Component, inject } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { MatTooltip } from '@angular/material/tooltip';
import { IconComponent } from 'libs/components/src/lib/icon.component';
import { EditorStateService } from './editor-state.service';

@Component({
    selector: 'editor-controls',
    template: `
        <div class="flex flex-col items-center gap-1 overflow-hidden">
            <button
                icon
                default
                matRipple
                [class.bg-primary!]="action === 'rect'"
                [class.text-primary-content!]="action === 'rect'"
                matTooltip="Draw Rectangle"
                matTooltipPosition="right"
                (click)="setAction('rect')"
            >
                <icon>aspect_ratio</icon>
            </button>
            <button
                icon
                default
                matRipple
                [class.bg-primary!]="action === 'add_points'"
                [class.text-primary-content!]="action === 'add_points'"
                matTooltip="Add Points"
                matTooltipPosition="right"
                (click)="setAction('add_points')"
            >
                <icon>add_circle</icon>
            </button>
            <button
                icon
                default
                matRipple
                [class.bg-primary!]="action === 'remove_points'"
                [class.text-primary-content!]="action === 'remove_points'"
                matTooltip="Remove Points"
                matTooltipPosition="right"
                (click)="setAction('remove_points')"
            >
                <icon>remove_circle</icon>
            </button>
        </div>
    `,
    styles: [``],
    imports: [MatRipple, MatTooltip, IconComponent],
})
export class EditorControlsComponent {
    private _state = inject(EditorStateService);

    public get action() {
        return this._state.action;
    }

    public readonly setAction = (a) => this._state.setAction(a);
}
