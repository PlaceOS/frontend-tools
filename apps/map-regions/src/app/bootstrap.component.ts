import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'map-region-bootstrap',
    template: `
        <div class="bg-base-200 absolute inset-0">
            <form
                class="bg-base-100 border-base-300 absolute top-2 left-1/2 w-120 -translate-x-1/2 overflow-hidden rounded-lg border shadow"
            >
                <h3 class="mb-0! w-full p-3 text-xl font-medium text-white">
                    Input SVG URL to continue
                </h3>
                <div class="flex flex-col gap-4 p-4">
                    <mat-form-field
                        appearance="outline"
                        class="no-subscript w-full"
                    >
                        <input
                            matInput
                            name="map-url"
                            [ngModel]="url()"
                            (ngModelChange)="url.set($event)"
                            [ngModelOptions]="{ standalone: true }"
                            placeholder="SVG URL e.g. https://my.domain/path/to/file.svg"
                        />
                    </mat-form-field>
                    <a btn class="w-32" [routerLink]="['/editor', url()]">
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
    imports: [FormsModule, MatFormField, MatInput, RouterLink],
})
export class BootstrapComponent {
    /** URL of the map to edit */
    public readonly url = signal('');
}
