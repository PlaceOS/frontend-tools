import { Component } from '@angular/core';

@Component({
    standalone: false,
    selector: 'map-region-bootstrap',
    template: `
        <div class="absolute inset-0 bg-gray-100 flex justify-center">
            <form
                class="bg-white shadow rounded m-4 flex flex-col space-y-2 flex-none items-center h-52 overflow-hidden"
            >
                <h3 class="text-white w-full mb-2 py-2 px-4 text-lg">
                    Input SVG URL to continue
                </h3>
                <mat-form-field appearance="outline">
                    <input
                        matInput
                        name="map-url"
                        [(ngModel)]="url"
                        [ngModelOptions]="{ standalone: true }"
                        placeholder="SVG URL e.g. https://my.domain/path/to/file.svg"
                    />
                </mat-form-field>
                <a
                    button
                    mat-button
                    class="w-32"
                    [disabled]="!url"
                    [routerLink]="['/editor', url]"
                >
                    View Map
                </a>
            </form>
        </div>
    `,
    styles: [
        `
            form {
                width: 32em;
            }

            mat-form-field {
                width: 30em;
            }

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
