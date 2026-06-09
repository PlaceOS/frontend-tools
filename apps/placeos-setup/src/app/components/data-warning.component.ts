import { Component, Input } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { OrganisationService } from '../organisation/organisation.service';

@Component({
    standalone: false,
    selector: 'data-warning',
    template: `
        @if (
          (levels && !(has_both | async)) ||
          (!levels && !(has_building | async))
          ) {
          <div
            class="absolute inset-0 bg-black/60 flex flex-col items-center justify-center space-y-2"
            >
            @if (levels && !(has_both | async)) {
              <div>
                A building and level is required for this features
              </div>
            }
            @if (!levels && !(has_building | async)) {
              <div>
                A building is required for this feature
              </div>
            }
            <a
              button
              mat-button
              [routerLink]="['/organisation']"
              [queryParams]="{ add: 'building' }"
              class="w-48"
              >
              Add Building
            </a>
            @if (levels && (has_building | async)) {
              <a
                button
                mat-button
                [routerLink]="['/organisation']"
                [queryParams]="{ add: 'level' }"
                class="w-48"
                >
                Add Level
              </a>
            }
          </div>
        }
        `,
    styles: [``],

})
export class DataWarningComponent {
    @Input() public levels: boolean = false;

    public readonly has_building = this._org.buildings.pipe(
        map((_) => _.length > 0),
        tap((_) => console.log('Has Building:', _))
    );
    public readonly has_level = this._org.levels.pipe(
        map((_) => _.length > 0),
        tap((_) => console.log('Has Level:', _))
    );
    public readonly has_both = combineLatest([
        this.has_building,
        this.has_level,
    ]).pipe(
        map(([b, l]) => b && l),
        tap((_) => console.log('Has Both:', _))
    );

    constructor(private _org: OrganisationService) {}
}
