import { Component, computed, inject, signal } from '@angular/core';
import { CustomTooltipComponent } from './custom-tooltip.component';
import { MAP_FEATURE_DATA } from './map-viewer/map-types';

export interface MapPointData {
    name: string;
    active: boolean;
    clicked: () => void;
}

@Component({
    selector: '[map-point]',
    template: `
        <div (click)="onClick($event)">
            <div
                class="pointer-events-auto absolute top-1/2 left-1/2 flex h-3 w-3 -translate-x-1/2 -translate-y-1/2 transform"
                customTooltip
                [content]="name_display"
                [hover]="true"
                xPosition="center"
                yPosition="bottom"
                [backdrop]="false"
            >
                <div
                    class="absolute inset-0 -translate-x-1.5"
                    [class.opacity-0]="!active()"
                >
                    <div
                        class="bg-success absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                    ></div>
                </div>
                <div
                    class="relative inline-flex h-full w-full rounded-full border-2 bg-white"
                    [class.border-black]="!active()"
                    [class.border-success]="active()"
                ></div>
            </div>
        </div>
        <ng-template #name_display>
            <div
                class="pointer-events-none m-2 rounded border border-gray-50 bg-white px-2 py-1 text-sm shadow"
            >
                {{ name() || '&lt;No name&gt;' }}
            </div>
        </ng-template>
    `,
    styles: [``],
    imports: [CustomTooltipComponent],
})
export class MapPointComponent {
    private readonly _details = signal(inject<MapPointData>(MAP_FEATURE_DATA));

    /** Whether point should be displayed as active */
    public readonly active = computed(() => this._details().active);
    /** Point display name */
    public readonly name = computed(() => this._details().name);

    public readonly onClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!this.active()) this._details().clicked?.();
    };
}
