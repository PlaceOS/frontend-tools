import { Component } from '@angular/core';

@Component({
    selector: '[map-builder-home]',
    template: `
        <div
            class="flex flex-col items-center bg-white border border-gray-200 rounded p-4 mx-auto"
        >
            <img src="assets/logo-light.svg" alt="PlaceOS" />
            <h2>Map Builder</h2>
        </div>
    `,
    styles: [
        `
            :host {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                padding: 1rem;
            }

            :host > div {
                width: 24rem;
                max-width: calc(100vw - 2rem);
            }

            img {
                width: 16rem;
                max-width: calc(100% - 2rem);
            }
        `,
    ],
})
export class HomeComponent {}
