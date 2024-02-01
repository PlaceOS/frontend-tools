import { Component, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseClass, sendMessage } from '@placeos-tools/common';
import { EditorStateService } from './editor-state.service';

@Component({
    selector: 'wayfinding-editor',
    template: `
        <div class="relative h-full flex-1">
            <i-map
                class="w-screen h-screen"
                [src]="url | async"
                [features]="features | async"
                [actions]="actions"
            ></i-map>
        </div>
        <div
            class="absolute top-2 left-2 bg-white rounded shadow p-2 w-52 space-y-2"
            *ngIf="(method | async) !== 'testing'"
        >
            <div class="flex flex-col flex-1">
                <mat-form-field appearance="outline" class="w-full h-16">
                    <mat-label>Map width</mat-label>
                    <input
                        matInput
                        type="number"
                        [ngModel]="(size | async)[0] / 100"
                    />
                    <span matSuffix>m</span>
                </mat-form-field>
            </div>
        </div>
        <div
            class="absolute top-1/2 left-2 -translate-y-1/2 bg-white rounded shadow overflow-hidden flex flex-col divide-y divide-solid divide-gray-200"
            *ngIf="(method | async) !== 'testing'"
        >
            <button
                mat-icon-button
                class="rounded-none border-x-0"
                matTooltip="Add Waypoints"
                matTooltipPosition="right"
                [class.bg-primary]="(method | async) === 'add'"
                [class.text-white]="(method | async) === 'add'"
                (click)="setMethod('add')"
            >
                <app-icon>add_location_alt</app-icon>
            </button>
            <button
                mat-icon-button
                class="rounded-none border-x-0"
                matTooltip="Connect Waypoints"
                matTooltipPosition="right"
                [class.bg-primary]="(method | async) === 'link'"
                [class.text-white]="(method | async) === 'link'"
                (click)="setMethod('link')"
            >
                <app-icon>share</app-icon>
            </button>
            <button
                mat-icon-button
                class="rounded-none border-x-0"
                matTooltip="Remove Waypoints"
                matTooltipPosition="right"
                [class.bg-primary]="(method | async) === 'remove'"
                [class.text-white]="(method | async) === 'remove'"
                (click)="setMethod('remove')"
            >
                <app-icon>wrong_location</app-icon>
            </button>
            <button
                mat-icon-button
                class="rounded-none border-x-0"
                matTooltip="Set Feature Location"
                matTooltipPosition="right"
                [class.bg-primary]="(method | async) === 'set-feature'"
                [class.text-white]="(method | async) === 'set-feature'"
                (click)="setMethod('set-feature')"
            >
                <app-icon>push_pin</app-icon>
            </button>
        </div>
        <div
            class="absolute bottom-2 right-2 flex items-center space-x-2 w-[36rem]"
        >
            <button
                mat-button
                class="bg-white text-black flex-1"
                *ngIf="(method | async) !== 'testing'"
                (click)="setMethod('testing')"
            >
                <div class="flex items-center">
                    <app-icon class="mr-4">save_alt</app-icon>
                    Test Wayfinding
                </div>
            </button>
            <button
                mat-button
                class="bg-white text-black flex-1"
                *ngIf="(method | async) === 'testing'"
                (click)="setMethod('add')"
            >
                <div class="flex items-center">
                    <app-icon class="mr-4">save_alt</app-icon>
                    Configure Wayfinding
                </div>
            </button>
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
                user-select: none;
            }
        `,
    ],
})
export class WayfindingEditorComponent extends BaseClass {
    public readonly url = this._editor.url;
    public readonly size = this._editor.size;
    public readonly features = this._editor.features;
    public readonly method = this._editor.method;
    public readonly actions = this._editor.actions;
    public readonly embeded = this._editor.embeded;
    public readonly select_box = { top: 0, left: 0, width: 0, height: 0 };
    public select_start = [0, 0];
    public selecting = false;

    public readonly setMethod = (s) => this._editor.setMethod(s);
    public readonly saveMetadata = () => this._editor.saveMetadata();
    public readonly copyMetadata = () => this._editor.copyMetadata();

    constructor(
        private _editor: EditorStateService,
        private _route: ActivatedRoute,
        private _renderer: Renderer2
    ) {
        super();
    }

    public ngOnInit() {
        this.subscription(
            'route.params',
            this._route.paramMap.subscribe(async (params) => {
                if (params.has('src')) {
                    const src = await sendMessage({
                        type: 'backoffice',
                        action: 'resource',
                        name: params.get('src'),
                        content: {},
                    }).catch((_) => '');
                    this._editor.setURL(src || params.get('src'));
                }
            })
        );
    }
}
