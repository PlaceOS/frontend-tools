import { Component, Inject } from '@angular/core';
import { MAP_FEATURE_DATA } from './interactive-map.component';

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
                class="flex h-3 w-3 absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto "
                customTooltip
                [content]="name_display"
                [hover]="true"
                xPosition="center"
                yPosition="bottom"
                [backdrop]="false"
            >
                <div class="absolute inset-0" [class.opacity-0]="!active">
                    <div
                        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"
                    ></div>
                </div>
                <div
                    class="relative inline-flex rounded-full h-full w-full border-2 bg-white"
                    [class.border-black]="!active"
                    [class.border-success]="active"
                ></div>
            </div>
        </div>
        <ng-template #name_display>
            <div
                class="bg-white px-2 py-1 shadow pointer-events-none m-2 rounded border border-gray-50 text-sm"
            >
                {{ name || '&lt;No name&gt;' }}
            </div>
        </ng-template>
    `,
    styles: [``],
})
export class MapPointComponent {
    /** Whether point should be displayed as active */
    public readonly active = this._details.active;
    /** Whether point should be displayed as active */
    public readonly name = this._details.name;

    public readonly onClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this._details.clicked && !this.active ? this._details.clicked() : null;
    };

    constructor(@Inject(MAP_FEATURE_DATA) private _details: MapPointData) {}
}
