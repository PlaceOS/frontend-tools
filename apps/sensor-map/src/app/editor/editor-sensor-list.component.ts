import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatRipple } from '@angular/material/core';
import { IconComponent } from '../../../../../libs/components/src/lib/icon.component';
import { EditorStateService } from './editor-state.service';

@Component({
    selector: 'editor-sensor-list',
    template: `
        <div
            class="border-base-300 my-2 -ml-2 flex h-[calc(100vh-1rem)] w-full flex-col items-center overflow-hidden rounded-xl border bg-white shadow"
        >
            <div
                class="border-base-300 relative mx-2 mt-2 flex w-[calc(100%-1rem)] rounded-lg border p-2 shadow"
            >
                <icon class="text-2xl">search</icon>
                <input
                    class="absolute inset-0 rounded-lg py-2 pl-10"
                    placeholder="Search sensors..."
                    [ngModel]="search()"
                    (ngModelChange)="search.set($event)"
                />
            </div>
            <ul
                class="divide-base-200 w-full flex-1 list-none divide-y overflow-auto p-0"
            >
                @for (sensor of sensor_list(); track sensor.id) {
                    <li
                        role="button"
                        class="hover:bg-base-200 flex cursor-pointer items-center p-2"
                        [class.bg-primary!]="active_sensor()?.id === sensor.id"
                        [class.text-primary-content]="
                            active_sensor()?.id === sensor.id
                        "
                        matRipple
                        (click)="setActive(sensor)"
                    >
                        <div details class="w-1/2 flex-1">
                            <div class="w-full truncate" [title]="sensor.id">
                                {{ sensor.id }}
                            </div>
                            <div class="truncate font-mono text-xs opacity-60">
                                {{ sensor.name || '[No Name]' }}
                            </div>
                            <ng-template #no_location>
                                <div class="text-xs opacity-60">
                                    No location
                                </div>
                            </ng-template>
                        </div>
                        @if (sensor.has_location) {
                            <icon class="text-2xl"> pin_drop </icon>
                        }
                    </li>
                } @empty {
                    <div
                        class="bg-base-200 m-2 flex h-64 w-[calc(100%-1rem)] flex-col items-center justify-center gap-2 rounded-lg p-4"
                    >
                        <icon class="text-5xl">sensors_off</icon>
                        <p>No sensors to place</p>
                    </div>
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
