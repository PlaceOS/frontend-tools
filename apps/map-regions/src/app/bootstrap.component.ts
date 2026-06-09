import { Component } from '@angular/core';

@Component({
    standalone: false,
    selector: 'map-region-bootstrap',
    template: `
        <div class="absolute inset-0 bg-base-200">
            <form
                class="absolute w-120 top-2 left-1/2 -translate-x-1/2 bg-base-100 shadow rounded-lg overflow-hidden border border-base-300"
            >
                <h3 class="text-white w-full p-3 mb-0! text-xl font-medium">
                    Input SVG URL to continue
                </h3>
                <div class="p-4 flex flex-col gap-4">
                    <mat-form-field
                        appearance="outline"
                        class="w-full no-subscript"
                    >
                        <input
                            matInput
                            name="map-url"
                            [(ngModel)]="url"
                            [ngModelOptions]="{ standalone: true }"
                            placeholder="SVG URL e.g. https://my.domain/path/to/file.svg"
                        />
                    </mat-form-field>
                    <a btn class="w-32" [routerLink]="['/editor', url]">
                        View Map
                    </a>
                </div>
            </form>
        </div>
    `,
    styles: [
        `
            h3 {
                background-color: #b71c1c;
            }
        `,
    ],
})
export class BootstrapComponent {
    /** URL of the map to edit */
    public url = '';
}
