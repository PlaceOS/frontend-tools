import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BaseClass } from '@placeos-tools/common';

import { EditorStateService } from './editor-state.service';

@Component({
    selector: '[sensor-map-editor]',
    template: `
        <div class="relative h-full flex-1">
            <i-map
                class="w-screen h-screen"
                [src]="url | async"
                [features]="features | async"
                [actions]="actions"
            ></i-map>
            <div
                class="absolute bottom-2 right-2 flex items-center space-x-2 w-[26rem]"
            >
                <button
                    mat-button
                    class="bg-white text-black flex-1"
                    (click)="saveMetadata()"
                >
                    <div class="flex items-center">
                        <app-icon class="mr-4">save_alt</app-icon>
                        {{ (embeded | async) ? 'Save' : 'Download' }} Metadata
                    </div>
                </button>
                <button
                    mat-button
                    class="bg-white text-black flex-1"
                    (click)="copyMetadata()"
                >
                    <div class="flex items-center">
                        <app-icon class="mr-4">content_copy</app-icon>
                        Copy Metadata
                    </div>
                </button>
            </div>
        </div>
        <div class="w-64 h-full">
            <editor-sensor-list></editor-sensor-list>
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
                overflow: hidden;
                background-color: #f0f0f0;
                display: flex;
            }

            [controls] {
                width: 24rem;
            }
        `,
    ],
})
export class EditorComponent extends BaseClass implements OnInit {
    /** URL of the map to display */
    public readonly url = this._state.url;
    /** Whether UI is embeded */
    public readonly embeded = this._state.embeded;
    public readonly features = this._state.features;
    public actions = [
        { id: '*', action: 'click', callback: (_, p) => this.clicked(p) },
        { id: '*', action: 'touchend', callback: (_, p) => this.clicked(p) },
    ];

    public readonly clicked = (p) => this._state.setSensorPosition(p);

    public readonly saveMetadata = () => this._state.saveMetadata();
    public readonly copyMetadata = () => this._state.copyMetadata();

    constructor(
        private _state: EditorStateService,
        private _route: ActivatedRoute
    ) {
        super();
    }

    public ngOnInit(): void {
        const handle_params = (params: ParamMap) => {
            if (params.has('src')) {
                this._state.setURL(params.get('src') as string);
            }
        };
        this.subscription(
            'route.query',
            this._route.queryParamMap.subscribe(handle_params)
        );
        this.subscription(
            'route.params',
            this._route.paramMap.subscribe(handle_params)
        );
    }
}
