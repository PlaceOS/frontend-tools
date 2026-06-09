import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'wayfindiing-bootstrap',
    template: `
        <div class="absolute inset-0 flex justify-center bg-gray-100">
            <form
                class="m-4 flex h-52 w-[32rem] flex-none flex-col items-center space-y-2 overflow-hidden rounded bg-white shadow"
            >
                <h3 class="mb-2 w-full bg-red-700 px-4 py-2 text-lg text-white">
                    Input SVG URL to continue
                </h3>
                <mat-form-field appearance="outline" class="w-[30rem]">
                    <input
                        matInput
                        name="map-url"
                        [ngModel]="url()"
                        (ngModelChange)="url.set($event)"
                        placeholder="SVG URL e.g. https://my.domain/path/to/file.svg"
                    />
                </mat-form-field>
                <a
                    button
                    mat-button
                    class="w-32"
                    [disabled]="!url()"
                    [routerLink]="['/editor', url()]"
                >
                    View Map
                </a>
            </form>
        </div>
    `,
    styles: [``],
    imports: [FormsModule, MatFormField, MatInput, MatButton, RouterLink],
})
export class BootstrapComponent {
    /** URL of the map to edit */
    public readonly url = signal('');
}
