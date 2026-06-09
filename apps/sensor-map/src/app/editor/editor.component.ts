import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BaseClass, sendMessage } from '@placeos-tools/common';

import { MatRipple } from '@angular/material/core';
import { IconComponent } from '../../../../../libs/components/src/lib/icon.component';
import { DynamicMapComponent } from '../../../../../libs/components/src/lib/map-viewer/dynamic-map.component';
import { EditorSensorListComponent } from './editor-sensor-list.component';
import { EditorStateService } from './editor-state.service';

@Component({
    selector: '[sensor-map-editor]',
    template: `
        <div class="relative h-full flex-1">
            <i-map
                class="h-screen w-screen"
                [src]="url()"
                [features]="features()"
                [actions]="actions()"
            />
            <div
                class="absolute right-2 bottom-2 flex flex-wrap items-center justify-end"
            >
                <button btn matRipple class="m-1" (click)="saveMetadata()">
                    <div class="flex items-center">
                        <app-icon class="mr-4">save_alt</app-icon>
                        {{ embeded() ? 'Save' : 'Download' }} Metadata
                    </div>
                </button>
                <button btn matRipple class="m-1" (click)="copyMetadata()">
                    <div class="flex items-center">
                        <app-icon class="mr-4">content_copy</app-icon>
                        Copy Metadata
                    </div>
                </button>
            </div>
        </div>
        <div class="h-full w-64">
            <editor-sensor-list />
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
    imports: [
        DynamicMapComponent,
        MatRipple,
        IconComponent,
        EditorSensorListComponent,
    ],
})
export class EditorComponent extends BaseClass implements OnInit {
    private _editor = inject(EditorStateService);
    private _route = inject(ActivatedRoute);

    /** URL of the map to display */
    public readonly url = this._editor.url;
    /** Whether UI is embeded */
    public readonly embeded = this._editor.embeded;
    public readonly features = this._editor.features;
    public readonly actions = signal([
        { id: '*', action: 'click', callback: (_, p) => this.clicked(p) },
        { id: '*', action: 'touchend', callback: (_, p) => this.clicked(p) },
    ]);

    public readonly clicked = (p) => this._editor.setSensorPosition(p);

    public readonly saveMetadata = () => this._editor.saveMetadata();
    public readonly copyMetadata = () => this._editor.copyMetadata();

    public ngOnInit() {
        const handle_params = async (params: ParamMap) => {
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
        this._editor.loadSensorLocations();
    }
}
