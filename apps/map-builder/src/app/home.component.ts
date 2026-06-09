import { Component, OnInit, inject, signal } from '@angular/core';
import { randomString } from '@placeos-tools/common';

import { SlicePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../../libs/components/src/lib/icon.component';
import { MapDataService } from './data/map-data.service';

@Component({
    selector: '[map-builder-home]',
    template: `
        <div
            class="mx-auto flex flex-col items-center space-y-4 rounded border border-gray-200 bg-white p-4 shadow"
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
            @if (map_list()?.length) {
                @for (map of map_list() | slice: 0 : 5; track map) {
                    <a
                        button
                        mat-button
                        class="w-full"
                        [routerLink]="['/editor', map.id]"
                    >
                        <div class="flex items-center">
                            <app-icon>map</app-icon>
                            <div class="ml-4 flex-1 text-left">
                                {{ map.name }}
                            </div>
                            <div class="text-opacity-60 text-xs text-white">
                                {{ map.last_edited }}
                            </div>
                        </div>
                    </a>
                }
            } @else {
                <p>No recently edited maps on this machine.</p>
            }
            @if (map_list()?.length > 5) {
                <button mat-button class="inverse mb-4 w-full">
                    <div class="flex items-center justify-center">
                        {{ map_list()?.length - 5 }} More Maps
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
    imports: [MatButton, RouterLink, IconComponent, SlicePipe],
})
export class HomeComponent implements OnInit {
    private _data = inject(MapDataService);

    /** Signal for list of maps */
    public readonly map_list = this._data.maps;
    /** Store for new map ID */
    public readonly new_id = signal('');

    public readonly newMap = () => this._data.newMap(this.new_id());

    public ngOnInit(): void {
        this.new_id.set(`${randomString(16)}`);
    }
}
