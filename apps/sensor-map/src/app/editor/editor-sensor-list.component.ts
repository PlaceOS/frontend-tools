import { Component, inject } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { EditorStateService } from './editor-state.service';
import { FormsModule } from '@angular/forms';
import { MatRipple } from '@angular/material/core';
import { IconComponent } from '../../../../../libs/components/src/lib/icon.component';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'editor-sensor-list',
    template: `
        <div class="flex flex-col items-center w-full h-full bg-white shadow">
            <input
                class="w-full px-4 py-2 border-b border-base-300"
                placeholder="Search sensors..."
                [ngModel]="search$ | async"
                (ngModelChange)="search$.next($event)"
            />
            <ul class="list-none p-0 w-full flex-1 overflow-auto">
                @for (sensor of sensor_list | async; track sensor) {
                <li
                    class="flex items-center p-2 border-b border-base-200 cursor-pointer"
                    [class.bg-primary]="
                        (active_sensor | async)?.id === sensor.id
                    "
                    [class.text-white]="
                        (active_sensor | async)?.id === sensor.id
                    "
                    matRipple
                    (click)="setActive(sensor)"
                >
                    <div details class="flex-1 w-1/2">
                        <div class="w-full truncate" [title]="sensor.id">
                            {{ sensor.id }}
                        </div>
                        <div class="text-xs opacity-60">
                            {{ sensor.name || '[No Name]' }}
                        </div>
                        <ng-template #no_location>
                            <div class="text-xs opacity-60">No location</div>
                        </ng-template>
                    </div>
                    @if (sensor.has_location) {
                    <app-icon class="text-2xl"> pin_drop </app-icon>
                    }
                </li>
                }
            </ul>
        </div>
    `,
    styles: [
        `
            :host {
                height: 100%;
                width: 100%;
            }
        `,
    ],
    imports: [FormsModule, MatRipple, IconComponent, AsyncPipe],
})
export class EditorSensorListComponent {
    private _state = inject(EditorStateService);

    public readonly search$ = new BehaviorSubject('');
    public readonly sensor_list = combineLatest([
        this._state.sensor_details,
        this.search$,
    ]).pipe(
        debounceTime(100),
        map(([list, search]) =>
            list.filter((_) =>
                _.name?.toLowerCase().includes(search?.toLowerCase())
            )
        )
    );
    public readonly active_sensor = this._state.active_sensor;

    public readonly setActive = (s) => this._state.setActive(s);
}
