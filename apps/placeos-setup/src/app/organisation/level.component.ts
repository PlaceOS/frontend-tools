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
                <mat-checkbox></mat-checkbox>
            </div>
            <div class="min-w-0 w-10 p-0"></div>
            <div class="w-48">{{ level.display_name }}</div>
            <div></div>
            <div></div>
            <div class="w-48"></div>
            <div></div>
            <div></div>
            <div>{{ level.allow_visitors ? 'YES' : 'NO' }}</div>
            <div>{{ level.catering_available ? 'YES' : 'NO' }}</div>
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
        `,
    ],
})
export class OrganisationLevelComponent {
    @Input() public level: BuildingLevel;

    constructor(private _org: OrganisationService) {}
}
