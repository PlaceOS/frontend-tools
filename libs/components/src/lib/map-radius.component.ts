import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { MAP_FEATURE_DATA } from './map-viewer/map-types';

export interface MapRadiusData {
    message: string;
    radius: number;
    fill: string;
    stroke: string;
}

@Component({
    selector: '[map-radius]',
    template: `
        @if (show()) {
            <div
                class="center rounded-full border-4 border-dashed"
                [style.border-color]="stroke()"
                [style.background-color]="fill() + '40'"
                [style.width]="radius() * 100 + '%'"
                [style.height]="radius() * 100 + '%'"
            ></div>
            @if (message() && show_message()) {
                <div
                    name="message()"
                    [style.top]="'-' + radius() * 100 + '%'"
                    class="whitespace-no-wrap absolute top-0 m-2 rounded bg-white p-2 text-gray-700 shadow"
                >
                    {{ message() }}
                </div>
            }
        }
    `,
    styles: [
        `
            :host {
                position: absolute;
                height: 100%;
                width: 100%;
            }

            [name='message'] {
                transform: translateX(-50%);
            }

            div {
                animation: fade-in-top 1s;
            }

            @keyframes fade-in-top {
                0% {
                    opacity: 0;
                    transform: translate(-50%, -100%);
                }
                100% {
                    opacity: 1;
                    transform: translate(-50%, 0%);
                }
            }
        `,
    ],
})
export class MapRadiusComponent implements OnInit {
    private readonly _details = signal(inject<MapRadiusData>(MAP_FEATURE_DATA));

    /** Message to display above the pin */
    public readonly message = computed(() => this._details().message);
    /** Fill colour for the pin SVG */
    public readonly fill = computed(() => this._details().fill || '#e53935');
    /** Fill colour for the pin SVG */
    public readonly radius = computed(() => this._details().radius || 10);
    /** Stroke colour for the pin SVG */
    public readonly stroke = computed(
        () => this._details().stroke || '#e53935',
    );

    public readonly show = signal(false);
    public readonly show_message = signal(false);

    public ngOnInit() {
        setTimeout(() => this.show.set(true), 300);
        setTimeout(() => this.show_message.set(true), 1000);
    }
}
