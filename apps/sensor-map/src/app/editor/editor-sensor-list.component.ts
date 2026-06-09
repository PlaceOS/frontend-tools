import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatRipple } from '@angular/material/core';
import { IconComponent } from '../../../../../libs/components/src/lib/icon.component';
import { EditorStateService } from './editor-state.service';

@Component({
    selector: 'editor-sensor-list',
    template: `
        <div class="flex h-full w-full flex-col items-center bg-white shadow">
            <input
                class="border-base-300 w-full border-b px-4 py-2"
                placeholder="Search sensors..."
                [ngModel]="search()"
                (ngModelChange)="search.set($event)"
            />
            <ul class="w-full flex-1 list-none overflow-auto p-0">
                @for (sensor of sensor_list(); track sensor) {
                    <li
                        class="border-base-200 flex cursor-pointer items-center border-b p-2"
                        [class.bg-primary]="active_sensor()?.id === sensor.id"
                        [class.text-white]="active_sensor()?.id === sensor.id"
                        matRipple
                        (click)="setActive(sensor)"
                    >
                        <div details class="w-1/2 flex-1">
                            <div class="w-full truncate" [title]="sensor.id">
                                {{ sensor.id }}
                            </div>
                            <div class="text-xs opacity-60">
                                {{ sensor.name || '[No Name]' }}
                            </div>
                            <ng-template #no_location>
                                <div class="text-xs opacity-60">
                                    No location
                                </div>
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
    imports: [FormsModule, MatRipple, IconComponent],
})
export class EditorSensorListComponent {
    private _state = inject(EditorStateService);

    public readonly search = signal('');
    public readonly sensor_list = computed(() =>
        this._state
            .sensor_details()
            .filter((_) =>
                _.name?.toLowerCase().includes(this.search()?.toLowerCase()),
            ),
    );
    public readonly active_sensor = this._state.active_sensor;

    public readonly setActive = (s) => this._state.setActive(s);
}
