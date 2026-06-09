import { Component } from '@angular/core';
import { EditorStateService } from './editor-state.service';

@Component({
    standalone: false,
    selector: 'editor-options',
    template: `
        <div
          class="flex flex-col items-center h-full bg-base-100 divide-y divide-base-200 shadow border-r border-base-300"
          >
          <div class="w-full p-4">
            <h3 class="font-medium">Map Settings</h3>
            <div class="flex items-center space-x-2">
              <div class="w-px flex-1">
                <label class="mb-2">Width:</label>
                <mat-form-field
                  appearance="outline"
                  class="w-full no-subscript"
                  >
                  <input
                    matInput
                    type="number"
                    placeholder="Map Width"
                    [ngModel]="width | async"
                    (ngModelChange)="setWidth($event)"
                    />
                </mat-form-field>
              </div>
              <div class="w-px flex-1">
                <label class="mb-2">Height:</label>
                <mat-form-field
                  appearance="outline"
                  class="w-full no-subscript"
                  >
                  <input
                    matInput
                    type="number"
                    placeholder="Map Height"
                    [ngModel]="height | async"
                    (ngModelChange)="setWidth($event)"
                    />
                </mat-form-field>
              </div>
            </div>
          </div>
          <div class="w-full flex-1 flex flex-col h-1/2 p-4">
            <button btn matRipple class="w-full mb-2" (click)="newRegion()">
              <div class="flex items-center">
                <app-icon class="mr-4">add</app-icon>
                New Region
              </div>
            </button>
            <div class="h-[50vh] flex-1 overflow-auto w-full">
              @if ((regions | async)?.length) {
                @for (
                  region of regions | async; track
                  region; let i = $index) {
                  <div
                    class="p-2 hover:bg-base-300 even:bg-base-200 border border-base-100 rounded flex items-center space-x-1 cursor-pointer"
                    (click)="setActiveRegion(region)"
                            [class.!border-primary]="
                                region.id === (active_region | async)?.id
                            "
                    matRipple
                    >
                    <input type="color" [(ngModel)]="region.color" />
                    <mat-form-field appearance="outline" class="w-16">
                      <input
                        matInput
                        type="number"
                        [(ngModel)]="region.capacity"
                        placeholder="Capacity"
                        />
                    </mat-form-field>
                    <mat-form-field appearance="outline" class="flex-1">
                      <input
                        matInput
                        type="text"
                        placeholder="Region ID"
                        [(ngModel)]="region.name"
                        />
                    </mat-form-field>
                    <button
                      mat-icon-button
                                (click)="
                                    removeRegion(region);
                                    $event.stopPropagation()
                                "
                      >
                      <app-icon>close</app-icon>
                    </button>
                  </div>
                }
              } @else {
                <p
                  class="p-8 h-32 flex items-center justify-center rounded bg-base-200"
                  >
                  No regions for map
                </p>
              }
            </div>
          </div>

          <div class="w-full p-4 space-y-2">
            <button btn matRipple class="w-full" (click)="saveMetadata()">
              <div class="flex items-center">
                <app-icon class="mr-4">save_alt</app-icon>
                {{ (embeded | async) ? 'Save' : 'Download' }} Metadata
              </div>
            </button>
            <button btn matRipple class="w-full" (click)="copyMetadata()">
              <div class="flex items-center">
                <app-icon class="mr-4">content_copy</app-icon>
                Copy Metadata
              </div>
            </button>
          </div>
        </div>
        `,
    styles: [
        `
            [type='color'] {
                width: 1.5rem;
                min-width: 1.5rem;
            }
            mat-form-field {
                min-width: 4rem;
                height: 3rem;
            }
            [counter] {
                transition: color 200ms, background-color 200ms;
            }
        `,
    ],

})
export class EditorOptionsComponent {
    /** Map regions for active map URL */
    public readonly regions = this._state.regions;
    /** Map regions for active map URL */
    public readonly embeded = this._state.embeded;
    /** Map regions for active map URL */
    public readonly active_region = this._state.active_region;
    /** Map regions for active map URL */
    public readonly height = this._state.height;
    /** Map regions for active map URL */
    public readonly width = this._state.width;

    public readonly setActiveRegion = (r) => this._state.setActiveRegion(r);
    public readonly newRegion = () => this._state.newRegion();
    public readonly removeRegion = (r) => this._state.removeRegion(r);
    public readonly setHeight = (h) => this._state.setHeight(h);
    public readonly setWidth = (w) => this._state.setWidth(w);
    public readonly saveMetadata = () => this._state.saveMetadata();
    public readonly copyMetadata = () => this._state.copyMetadata();

    constructor(private _state: EditorStateService) {}
}
