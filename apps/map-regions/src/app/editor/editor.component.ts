import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseClass, sendMessage } from '@placeos-tools/common';

import { EditorStateService } from './editor-state.service';
import { MapCanvasComponent } from 'libs/components/src/lib/map-canvas.component';

@Component({
    standalone: false,
    selector: '[map-regions-editor]',
    template: `
        <div controls class="relative h-full">
            <editor-options></editor-options>
        </div>
        <div class="relative h-full flex-1 bg-base-200">
            <i-map
                class="w-screen h-screen"
                [src]="url | async"
                [features]="features"
                [actions]="actions"
                [options]="{ disable_pan: true, disable_zoon: true }"
                (aspect_ratio)="setRatio($event)"
            ></i-map>
            <editor-controls
                class="absolute top-1/2 left-2 transform -translate-y-1/2"
            ></editor-controls>
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
                display: flex;
            }

            [controls] {
                width: 20rem;
            }
        `,
    ],

})
export class EditorComponent extends BaseClass implements OnInit {
    /** URL of the map to display */
    public readonly url = this._editor.url;
    public actions = [];
    /** Map regions for active map URL */
    public features = [
        {
            location: { x: 0.5, y: 0.5 },
            content: MapCanvasComponent,
            data: { polygons$: this._editor.regions },
        },
    ];
    public region_string = '';
    public ratio = 1;

    /** Handler for click events on the map */
    public readonly clicked = (n) => (_, p) =>
        this._editor.handleMapClick(n, p);
    public readonly setRatio = (r) => {
        this.ratio = r;
        this._editor.setRatio(r);
    };

    constructor(
        private _editor: EditorStateService,
        private _route: ActivatedRoute
    ) {
        super();
    }

    public ngOnInit(): void {
        this.actions = [
            { id: '*', action: 'mousedown', callback: this.clicked('start') },
            { id: '*', action: 'mousemove', callback: this.clicked('move') },
            { id: '*', action: 'mouseup', callback: this.clicked('end') },
            { id: '*', action: 'touchstart', callback: this.clicked('start') },
            { id: '*', action: 'touchmove', callback: this.clicked('move') },
            { id: '*', action: 'touchend', callback: this.clicked('end') },
        ];
        const handle_params = async (params) => {
            if (params.has('src')) {
                const src = await sendMessage({
                    type: 'backoffice',
                    action: 'resource',
                    name: params.get('src'),
                    content: {},
                }).catch((_) => '');
                console.log('Source:', src, params.get('src'));
                this._editor.setURL(
                    src || params.get('src'),
                    params.get('src')
                );
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
