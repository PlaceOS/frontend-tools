import { Component, OnInit, inject, signal } from '@angular/core';
import { randomInt, randomString } from '@placeos-tools/common';

import { MapDataService } from './data/map-data.service';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../../libs/components/src/lib/icon.component';
import { AsyncPipe, SlicePipe } from '@angular/common';

@Component({
    selector: '[map-builder-home]',
    template: `
        <div
            class="flex flex-col items-center bg-white border border-gray-200 rounded p-4 mx-auto space-y-4 shadow"
        >
            <img src="assets/logo-light.svg" alt="PlaceOS" />
            <h2>Map Builder</h2>

            <a
                button
                mat-button
                class="inverse w-full"
                (click)="newMap()"
                [routerLink]="['/editor', new_id()]"
            >
                <div class="flex items-center justify-center">
                    <app-icon>add</app-icon>
                    New Map
                </div>
            </a>

            <h3 class="underline">Recent Maps</h3>
            @if ((map_list | async)?.length) { @for (map of map_list | async |
            slice: 0:5; track map) {
            <a
                button
                mat-button
                class="w-full"
                [routerLink]="['/editor', map.id]"
            >
                <div class="flex items-center">
                    <app-icon>map</app-icon>
                    <div class="flex-1 text-left ml-4">{{ map.name }}</div>
                    <div class="text-xs text-white text-opacity-60">
                        {{ map.last_edited }}
                    </div>
                </div>
            </a>
            } } @else {
            <p>No recently edited maps on this machine.</p>
            } @if ((map_list | async)?.length > 5) {
            <button mat-button class="inverse w-full mb-4">
                <div class="flex items-center justify-center">
                    {{ (map_list | async)?.length - 5 }} More Maps
                </div>
            </button>
            }
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
                background-color: #f0f0f0;
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
    imports: [MatButton, RouterLink, IconComponent, AsyncPipe, SlicePipe],
})
export class HomeComponent implements OnInit {
    private _data = inject(MapDataService);

    /** Observable for list of maps */
    public readonly map_list = this._data.maps$;
    /** Store for new map ID */
    public readonly new_id = signal('');

    public readonly newMap = () => this._data.newMap(this.new_id());

    public ngOnInit(): void {
        this.new_id.set(`${randomString(16)}`);
    }
}
