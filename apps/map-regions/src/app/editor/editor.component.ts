import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseClass, HashMap } from '@placeos-tools/common';
import { MapPolygonComponent } from '@placeos-tools/components';

import { filter, map } from 'rxjs/operators';

import { EditorStateService } from './editor-state.service';

@Component({
    selector: '[map-regions-editor]',
    template: `
        <div controls class="relative h-full">
            <editor-options></editor-options>
        </div>
        <div class="relative h-full flex-1">
            <i-map
                class="w-screen h-screen"
                [src]="url | async"
                [features]="regions"
                [actions]="actions"
                [options]="{ disable_pan: true, disable_zoon: true }"
                (aspect_ratio)="setRatio($event)"
            ></i-map>
            <editor-controls
                class="absolute top-1/2 left-0 transform -translate-y-1/2"
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
    public actions = [];
    /** Map regions for active map URL */
    public regions = [];
    public region_string = '';
    public ratio = 1;

    /** Handler for click events on the map */
    public readonly clicked = (n) => (_, p) => this._state.handleMapClick(n, p);
    public readonly setRatio = (r) => {
        this.ratio = r;
        this._state.setRatio(r);
    };

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
        const handle_params = (params) => {
            if (params.has('src')) {
                this._state.setURL(params.get('src'));
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

        this._state.regions
            .pipe(
                map((l) =>
                    l.map((_) => {
                        const diff: HashMap<number> = _.points.reduce(
                            (m, [x, y]) => ({
                                x_min: x < m.x_min ? x : m.x_min,
                                x_max: x > m.x_max ? x : m.x_max,
                                y_min: y < m.y_min ? y : m.y_min,
                                y_max: y > m.y_max ? y : m.y_max,
                            }),
                            {
                                x_min: 100,
                                x_max: -100,
                                y_min: 100,
                                y_max: -100,
                            }
                        );
                        return {
                            location: {
                                x: diff.x_min + (diff.x_max - diff.x_min) / 2,
                                y: diff.y_min + (diff.y_max - diff.y_min) / 2,
                            },
                            content: MapPolygonComponent,
                            data: {
                                ..._,
                                ratio: this.ratio,
                                data$: this._state.regions.pipe(
                                    map((list) =>
                                        list.find((r) => r.id === _.id)
                                    ),
                                    filter((_) => !!_)
                                ),
                            },
                        };
                    })
                )
            )
            .subscribe((_) => {
                console.log('Ratio:', this.ratio);
                const str =
                    JSON.stringify(
                        _.map((_) => ({
                            location: _.location,
                            id: _.data.id,
                        }))
                    ) + `${this.ratio}`;
                if (this.region_string !== str) {
                    this.regions = _;
                    this.region_string = str;
                }
            });
    }
}
