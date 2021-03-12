import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseClass } from '@placeos-tools/common';
import { MapPolygonComponent } from '@placeos-tools/components';

import { filter, map } from 'rxjs/operators';

import { EditorStateService } from './editor-state.service';

@Component({
    selector: '[map-regions-editor]',
    template: `
        <div controls class="relative h-full">
            <editor-controls></editor-controls>
        </div>
        <div class="relative h-full flex-1">
            <i-map
                class="w-screen h-screen"
                [src]="url | async"
                [features]="regions"
                [actions]="actions"
                [options]="{ disable_pan: true, disable_zoon: true }"
                (aspect_ratio)="ratio = $event"
            ></i-map>
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
                width: 20rem;
            }
        `,
    ],
})
export class EditorComponent extends BaseClass implements OnInit {
    /** URL of the map to display */
    public readonly url = this._state.url;
    public actions = [];
    /** Map regions for active map URL */
    public regions = [];
    public region_string = '';
    public ratio = 1;

    /** Handler for click events on the map */
    public readonly clicked = (n) => (_, p) => this._state.handleMapClick(n, p);

    constructor(
        private _state: EditorStateService,
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
        this.subscription(
            'route.params',
            this._route.paramMap.subscribe((params) => {
                if (params.has('id')) {
                    this._state.setURL(params.get('id'));
                }
            })
        );

        this._state.regions
            .pipe(
                map((l) =>
                    l.map((_) => ({
                        location: {
                            x: _.points[0][0],
                            y: _.points[0][1],
                        },
                        content: MapPolygonComponent,
                        data: {
                            ..._,
                            ratio: this.ratio,
                            data$: this._state.regions.pipe(
                                map((list) => list.find((r) => r.id === _.id)),
                                filter((_) => !!_)
                            ),
                        },
                    }))
                )
            )
            .subscribe((_) => {
                const str = JSON.stringify(
                    _.map((_) => ({ location: _.location, id: _.data.id }))
                );
                if (this.region_string !== str) {
                    this.regions = _;
                    this.region_string = str;
                }
            });
    }
}
