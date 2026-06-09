import { Component } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccessControlService } from './access-control.service';

@Component({
    standalone: false,
    selector: 'app-organisation',
    template: `
        <div class="flex flex-col h-full w-full overflow-hidden relative">
          <header class="bg-neutral-700 p-2 space-x-2">
            <button mat-button class="w-48" (click)="newAccessControl()">
              Add Access Control
            </button>
            @if ((all_selected | async) || (some_selected | async)) {
              <button
                mat-button
                class="w-48"
                (click)="removeSelected()"
                >
                Remove Selected
              </button>
            }
          </header>
          <main class="w-full h-1/2 flex-1 overflow-auto">
            <div table>
              <div
                class="sticky top-0 flex items-center bg-neutral-800 border-b border-neutral-500 w-full"
                >
                <div thead class="min-w-0 w-10">
                  <mat-checkbox
                    [ngModel]="all_selected | async"
                    [indeterminate]="some_selected | async"
                    (ngModelChange)="setSelected($event)"
                  ></mat-checkbox>
                </div>
                <div thead>Type</div>
                <div thead>Building</div>
                <div thead>Managed Onsite?</div>
                <div thead>Isolated?</div>
                <div thead>Linked to Staff?</div>
                <div thead>Staff Linked to Passes?</div>
              </div>
              @if ((access_controls | async)?.length) {
                @for (item of access_controls | async; track item) {
                  <div
                    access-control-details
                    [item]="item"
                  ></div>
                }
              } @else {
                <div class="w-full h-full flex items-center justify-center p-8">
                  <p class="opacity-60">No access control setup for organisation</p>
                </div>
              }
            </div>
          </main>
          <data-warning></data-warning>
        </div>
        `,
    styles: [
        `
            [table] {
                width: 64rem;
            }

            [thead] {
                min-width: 10rem;
                width: 10rem;
                padding: 1rem;
                font-weight: 500;
                flex-shrink: 0;
            }

            [org-building]:nth-child(2n) {
                background-color: #00000008;
            }
        `,
    ],

})
export class AccessControlsComponent {
    public readonly access_controls = this._service.access_controls;

    public readonly newAccessControl = () => this._service.openAccessControlModal();
    public readonly setSelected = (s) => this._service.setSelected('*', s);
    public readonly removeSelected = () => this._service.removeSelected();
    public readonly all_selected = combineLatest([
        this._service.access_controls,
        this._service.selected,
    ]).pipe(map(([l, s]) => l.length === s.length && s.length > 0));
    public readonly some_selected = combineLatest([
        this._service.access_controls,
        this._service.selected,
    ]).pipe(map(([l, s]) => l.length !== s.length && s.length > 0));

    constructor(private _service: AccessControlService) {}
}
