import {
    Component,
    SimpleChanges,
    computed,
    inject,
    input,
    signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatTooltip } from '@angular/material/tooltip';
import { ANIMATION_SHOW_CONTRACT_EXPAND } from '@placeos-tools/common';
import { IconComponent } from '../../../../../libs/components/src/lib/icon.component';
import { OrganisationLevelComponent } from './level.component';
import { Building, OrganisationService } from './organisation.service';

@Component({
    selector: `org-building,[org-building]`,
    template: `
        <div
            details
            class="relative flex items-center border-b border-neutral-500 text-sm hover:bg-black/10"
        >
            <div thead class="min-w-0">
                <mat-checkbox
                    [ngModel]="selected"
                    (ngModelChange)="setSelected($event)"
                />
            </div>
            <div class="flex w-10 min-w-0 items-center justify-end p-0">
                <button
                    mat-icon-button
                    (click)="show.update((value) => !value)"
                    [disabled]="!levels()?.length"
                >
                    <app-icon>{{
                        show() ? 'expand_less' : 'expand_more'
                    }}</app-icon>
                </button>
            </div>
            <div class="w-56">{{ building().display_name }}</div>
            <div>{{ building().country }}</div>
            <div class="w-32">{{ building().city }}</div>
            <div class="w-56">{{ building().address }}</div>
            <div>{{ levels()?.length || 0 }}</div>
            <div>{{ building().currency }}</div>
            <div>{{ building().allow_visitors ? 'YES' : 'NO' }}</div>
            <div>{{ building().catering_available ? 'YES' : 'NO' }}</div>
            <div
                actions
                class="absolute top-1/2 left-24 flex min-w-0 -translate-y-1/2 items-center rounded-3xl bg-white !p-0 shadow dark:bg-neutral-700"
            >
                <button
                    mat-icon-button
                    matTooltip="Edit Building"
                    (click)="edit()"
                >
                    <app-icon>edit</app-icon>
                </button>
                <button
                    mat-icon-button
                    matTooltip="Delete Building"
                    (click)="remove()"
                >
                    <app-icon>delete</app-icon>
                </button>
            </div>
        </div>
        @if (levels()?.length) {
            <ul
                class="relative z-0 m-0 w-full list-none p-0"
                [class.shown]="show()"
                [@show]="show() ? 'show' : 'hide'"
            >
                @for (item of levels(); track item; let i = $index) {
                    <li
                        org-level
                        class="flex w-full items-center"
                        [level]="item"
                    ></li>
                }
            </ul>
        }
    `,
    styles: [
        `
            :host {
                min-width: 100%;
            }

            [details] > div {
                min-width: 6rem;
                padding: 1rem;
                flex-shrink: 0;
            }

            [actions] {
                opacity: 0;
                transition: opacity 200ms;
                pointer-events: none;
            }

            [details]:hover [actions] {
                opacity: 1;
                pointer-events: auto;
            }
        `,
    ],
    animations: [ANIMATION_SHOW_CONTRACT_EXPAND],
    imports: [
        MatCheckbox,
        FormsModule,
        MatIconButton,
        IconComponent,
        MatTooltip,
        OrganisationLevelComponent,
    ],
})
export class BuildingComponent {
    private _org = inject(OrganisationService);

    public readonly building = input<Building>(undefined);

    private _bld_id = signal('');

    public readonly show = signal(false);

    public readonly levels = computed(() =>
        this._org.levels().filter((lvl) => lvl.parent_id === this._bld_id()),
    );

    public readonly edit = () => this._org.openBuildingModal(this.building());
    public readonly remove = () => this._org.removeBuilding(this.building());
    public readonly setSelected = (s) =>
        this._org.setSelected(this.building().id, s);

    public get selected() {
        return this._org.isSelected(this.building().id);
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.building) {
            this._bld_id.set(this.building()?.id || '');
        }
    }
}
