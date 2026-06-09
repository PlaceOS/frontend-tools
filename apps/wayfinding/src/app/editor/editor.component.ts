import { Component, Renderer2, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
    MatFormField,
    MatLabel,
    MatSuffix,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { BaseClass, sendMessage } from '@placeos-tools/common';
import { IconComponent } from '../../../../../libs/components/src/lib/icon.component';
import { DynamicMapComponent } from '../../../../../libs/components/src/lib/map-viewer/dynamic-map.component';
import { EditorStateService } from './editor-state.service';

@Component({
    selector: 'wayfinding-editor',
    template: `
        <div class="relative h-full flex-1">
            <i-map
                class="h-screen w-screen"
                [src]="url()"
                [features]="features()"
                [actions]="actions()"
            />
        </div>
        @if (method() !== 'testing') {
            <div
                class="absolute top-2 left-2 w-52 space-y-2 rounded bg-white p-2 shadow"
            >
                <div class="flex flex-1 flex-col">
                    <mat-form-field appearance="outline" class="h-16 w-full">
                        <mat-label>Map width</mat-label>
                        <input
                            matInput
                            type="number"
                            [ngModel]="size()[0] / 100"
                        />
                        <span matSuffix>m</span>
                    </mat-form-field>
                </div>
            </div>
        }
        @if (method() !== 'testing') {
            <div
                class="absolute top-1/2 left-2 flex -translate-y-1/2 flex-col divide-y divide-solid divide-gray-200 overflow-hidden rounded bg-white shadow"
            >
                <button
                    mat-icon-button
                    class="rounded-none border-x-0"
                    matTooltip="Add Waypoints"
                    matTooltipPosition="right"
                    [class.bg-primary]="method() === 'add'"
                    [class.text-white]="method() === 'add'"
                    (click)="setMethod('add')"
                >
                    <app-icon>add_location_alt</app-icon>
                </button>
                <button
                    mat-icon-button
                    class="rounded-none border-x-0"
                    matTooltip="Connect Waypoints"
                    matTooltipPosition="right"
                    [class.bg-primary]="method() === 'link'"
                    [class.text-white]="method() === 'link'"
                    (click)="setMethod('link')"
                >
                    <app-icon>share</app-icon>
                </button>
                <button
                    mat-icon-button
                    class="rounded-none border-x-0"
                    matTooltip="Remove Waypoints"
                    matTooltipPosition="right"
                    [class.bg-primary]="method() === 'remove'"
                    [class.text-white]="method() === 'remove'"
                    (click)="setMethod('remove')"
                >
                    <app-icon>wrong_location</app-icon>
                </button>
                <button
                    mat-icon-button
                    class="rounded-none border-x-0"
                    matTooltip="Set Feature Location"
                    matTooltipPosition="right"
                    [class.bg-primary]="method() === 'set-feature'"
                    [class.text-white]="method() === 'set-feature'"
                    (click)="setMethod('set-feature')"
                >
                    <app-icon>push_pin</app-icon>
                </button>
            </div>
        }
        <div
            class="absolute right-2 bottom-2 flex w-[36rem] items-center space-x-2"
        >
            @if (method() !== 'testing') {
                <button
                    mat-button
                    class="flex-1 bg-white text-black"
                    (click)="setMethod('testing')"
                >
                    <div class="flex items-center">
                        <app-icon class="mr-4">save_alt</app-icon>
                        Test Wayfinding
                    </div>
                </button>
            }
            @if (method() === 'testing') {
                <button
                    mat-button
                    class="flex-1 bg-white text-black"
                    (click)="setMethod('add')"
                >
                    <div class="flex items-center">
                        <app-icon class="mr-4">save_alt</app-icon>
                        Configure Wayfinding
                    </div>
                </button>
            }
            <button
                mat-button
                class="flex-1 bg-white text-black"
                (click)="saveMetadata()"
            >
                <div class="flex items-center">
                    <app-icon class="mr-4">save_alt</app-icon>
                    {{ embeded() ? 'Save' : 'Download' }} Metadata
                </div>
            </button>
            <button
                mat-button
                class="flex-1 bg-white text-black"
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
    imports: [
        DynamicMapComponent,
        MatFormField,
        MatLabel,
        MatInput,
        FormsModule,
        MatSuffix,
        MatIconButton,
        MatTooltip,
        IconComponent,
        MatButton,
    ],
})
export class WayfindingEditorComponent extends BaseClass {
    private _editor = inject(EditorStateService);
    private _route = inject(ActivatedRoute);
    private _renderer = inject(Renderer2);

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
                    this._editor.setURL(
                        src || params.get('src'),
                        params.get('src'),
                    );
                }
            }),
        );
    }
}
