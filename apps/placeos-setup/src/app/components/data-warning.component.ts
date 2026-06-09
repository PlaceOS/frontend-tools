import { Component, computed, inject, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { OrganisationService } from '../organisation/organisation.service';

@Component({
    selector: 'data-warning',
    template: `
        @if ((levels() && !has_both()) || (!levels() && !has_building())) {
            <div
                class="absolute inset-0 flex flex-col items-center justify-center space-y-2 bg-black/60"
            >
                @if (levels() && !has_both()) {
                    <div>
                        A building and level is required for this features
                    </div>
                }
                @if (!levels() && !has_building()) {
                    <div>A building is required for this feature</div>
                }
                <a
                    button
                    mat-button
                    [routerLink]="['/organisation']"
                    [queryParams]="{ add: 'building' }"
                    class="w-48"
                >
                    Add Building
                </a>
                @if (levels() && has_building()) {
                    <a
                        button
                        mat-button
                        [routerLink]="['/organisation']"
                        [queryParams]="{ add: 'level' }"
                        class="w-48"
                    >
                        Add Level
                    </a>
                }
            </div>
        }
    `,
    styles: [``],
    imports: [MatButton, RouterLink],
})
export class DataWarningComponent {
    private _org = inject(OrganisationService);

    public readonly levels = input(false);

    public readonly has_building = computed(
        () => this._org.buildings().length > 0,
    );
    public readonly has_level = computed(() => this._org.levels().length > 0);
    public readonly has_both = computed(
        () => this.has_building() && this.has_level(),
    );
}
