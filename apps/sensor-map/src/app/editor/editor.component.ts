import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BaseClass, sendMessage } from '@placeos-tools/common';

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
    public readonly url = this._editor.url;
    /** Whether UI is embeded */
    public readonly embeded = this._editor.embeded;
    public readonly features = this._editor.features;
    public actions = [
        { id: '*', action: 'click', callback: (_, p) => this.clicked(p) },
        { id: '*', action: 'touchend', callback: (_, p) => this.clicked(p) },
    ];

    public readonly clicked = (p) => this._editor.setSensorPosition(p);

    public readonly saveMetadata = () => this._editor.saveMetadata();
    public readonly copyMetadata = () => this._editor.copyMetadata();

    constructor(
        private _editor: EditorStateService,
        private _route: ActivatedRoute
    ) {
        super();
    }

    public ngOnInit() {
        const handle_params = async (params: ParamMap) => {
            if (params.has('src')) {
                const src = await sendMessage({
                    type: 'backoffice',
                    action: 'resource',
                    name: params.get('src'),
                    content: {},
                }).catch((_) => '');
                this._editor.setURL(src || params.get('src'));
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
        this._editor.loadSensorLocations();
    }
}
