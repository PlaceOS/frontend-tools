import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseClass, sendMessage } from '@placeos-tools/common';

import { MapCanvasComponent } from 'libs/components/src/lib/map-canvas.component';
import { DynamicMapComponent } from '../../../../../libs/components/src/lib/map-viewer/dynamic-map.component';
import { EditorControlsComponent } from './editor-controls.component';
import { EditorOptionsComponent } from './editor-options.component';
import { EditorStateService } from './editor-state.service';

@Component({
    selector: '[map-regions-editor]',
    template: `
        <div controls class="bg-base-200 relative h-full">
            <editor-options />
        </div>
        <div class="bg-base-200 relative h-full flex-1">
            <i-map
                class="h-screen w-screen"
                [src]="url()"
                [features]="features()"
                [actions]="actions()"
                [options]="{ disable_pan: true, disable_zoom: true }"
                (aspect_ratio)="setRatio($event)"
            />
            <editor-controls
                class="absolute top-1/2 left-2 -translate-y-1/2 transform"
            />
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
    imports: [
        EditorOptionsComponent,
        DynamicMapComponent,
        EditorControlsComponent,
    ],
})
export class EditorComponent extends BaseClass implements OnInit {
    private _editor = inject(EditorStateService);
    private _route = inject(ActivatedRoute);

    /** URL of the map to display */
    public readonly url = this._editor.url;
    public readonly actions = signal([]);
    /** Map regions for active map URL */
    public readonly features = signal([
        {
            location: 'map-viewer-root',
            content: MapCanvasComponent,
            full_size: true,
            data: { polygons: this._editor.regions },
        },
    ]);
    public readonly ratio = signal(1);

    /** Handler for click events on the map */
    public readonly clicked = (n) => (_, p) =>
        this._editor.handleMapClick(n, p);
    public readonly setRatio = (r) => {
        this.ratio.set(r);
        this._editor.setRatio(r);
    };

    public ngOnInit(): void {
        this.actions.set([
            { id: '*', action: 'mousedown', callback: this.clicked('start') },
            { id: '*', action: 'mousemove', callback: this.clicked('move') },
            { id: '*', action: 'mouseup', callback: this.clicked('end') },
            { id: '*', action: 'touchstart', callback: this.clicked('start') },
            { id: '*', action: 'touchmove', callback: this.clicked('move') },
            { id: '*', action: 'touchend', callback: this.clicked('end') },
        ]);
        const handle_params = async (params) => {
            if (params.has('src')) {
                const src = await sendMessage({
                    type: 'backoffice',
                    action: 'resource',
                    name: params.get('src'),
                    content: {},
                }).catch((_) => '');
                this._editor.setURL(
                    src || params.get('src'),
                    params.get('src'),
                );
            }
        };
        this.subscription(
            'route.query',
            this._route.queryParamMap.subscribe(handle_params),
        );
        this.subscription(
            'route.params',
            this._route.paramMap.subscribe(handle_params),
        );
    }
}
