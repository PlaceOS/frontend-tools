import { Component, Input } from '@angular/core';
import { BuildingLevel, OrganisationService } from './organisation.service';

@Component({
    selector: `org-level,[org-level]`,
    template: `
        <div class="absolute bg-neutral-800 left-0 top-0 bottom-px w-2 min-h-0"></div>
        <div
            details
            class="flex items-center border-b border-neutral-500 text-sm hover:bg-black/10"
        >
            <div thead class="min-w-0 relative">
                <mat-checkbox [ngModel]="selected" (ngModelChange)="setSelected($event)"></mat-checkbox>
            </div>
            <div class="min-w-0 w-10 p-0"></div>
            <div class="w-56">{{ level.display_name }}</div>
            <div></div>
            <div class="w-32"></div>
            <div class="w-56"></div>
            <div></div>
            <div></div>
            <div>{{ level.allow_visitors ? 'YES' : 'NO' }}</div>
            <div>{{ level.catering_available ? 'YES' : 'NO' }}</div>
            <div
                actions
                class="absolute top-1/2 -translate-y-1/2 left-24 rounded-3xl flex items-center bg-white dark:bg-neutral-700 shadow !p-0 min-w-0"
            >
                <button mat-icon-button matTooltip="Edit Level" (click)="edit()">
                    <app-icon>edit</app-icon>
                </button>
                <button mat-icon-button matTooltip="Delete Level" (click)="remove()">
                    <app-icon>delete</app-icon>
                </button>
            </div>
        </div>
    `,
    styles: [
        `
            :host {
                min-width: 100%;
                position: relative;
            }

            [details] > div {
                min-width: 6rem;
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
})
export class OrganisationLevelComponent {
    @Input() public level: BuildingLevel;

    public readonly edit = () => this._org.openLevelModal(this.level);
    public readonly remove = () => this._org.removeLevel(this.level);
    public readonly setSelected = (s) => this._org.setSelected(this.level.id, s);

    public get selected() {
        return this._org.isSelected(this.level.id);
    }

    constructor(private _org: OrganisationService) {}
}
