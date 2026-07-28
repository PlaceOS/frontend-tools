import { Component, inject, signal } from '@angular/core';
import { IconComponent } from '@placeos-tools/components';

import { EditorStateService } from './editor-state.service';

@Component({
    selector: 'map-builder-layer-panel',
    template: `
        <div class="flex h-full flex-col">
            <div
                class="border-base-300 flex items-center justify-between border-b px-3 py-2.5"
            >
                <span class="text-xs font-bold">Layers</span>
                <span
                    class="bg-base-200 text-base-content/60 rounded-full px-2 py-0.5 text-xs font-semibold"
                >
                    {{ state.layers().length }}
                </span>
            </div>

            <div class="flex-1 overflow-y-auto">
                @for (
                    layer of state.sorted_layers();
                    track layer.id;
                    let i = $index
                ) {
                    <div
                        class="border-base-300 hover:bg-base-200 cursor-pointer border-b px-2 py-1.5"
                        [class.bg-primary-light]="
                            layer.id === state.active_layer_id()
                        "
                        [class.border-l-primary]="
                            layer.id === state.active_layer_id()
                        "
                        [class.border-l-2]="
                            layer.id === state.active_layer_id()
                        "
                        (click)="state.setActiveLayer(layer.id)"
                        (keyup.enter)="state.setActiveLayer(layer.id)"
                        tabindex="0"
                        role="button"
                    >
                        <div class="flex items-center gap-1">
                            <button
                                class="text-base-content/60 hover:text-base-content text-base"
                                [class.opacity-40]="!layer.visible"
                                [title]="
                                    layer.visible ? 'Hide layer' : 'Show layer'
                                "
                                (click)="
                                    toggle($event, layer.id, {
                                        visible: !layer.visible,
                                    })
                                "
                            >
                                <app-icon>
                                    {{
                                        layer.visible
                                            ? 'visibility'
                                            : 'visibility_off'
                                    }}
                                </app-icon>
                            </button>
                            <button
                                class="text-base-content/60 hover:text-base-content text-base"
                                [class.text-warning]="layer.locked"
                                [title]="
                                    layer.locked ? 'Unlock layer' : 'Lock layer'
                                "
                                (click)="
                                    toggle($event, layer.id, {
                                        locked: !layer.locked,
                                    })
                                "
                            >
                                <app-icon>
                                    {{ layer.locked ? 'lock' : 'lock_open' }}
                                </app-icon>
                            </button>
                            <span class="flex-1 truncate text-xs font-medium">
                                {{ layer.name }}
                            </span>
                            <button
                                class="text-base-content/40 hover:text-base-content text-base disabled:opacity-20"
                                title="Move up"
                                [disabled]="i === 0"
                                (click)="move($event, layer.id, 'up')"
                            >
                                <app-icon>arrow_upward</app-icon>
                            </button>
                            <button
                                class="text-base-content/40 hover:text-base-content text-base disabled:opacity-20"
                                title="Move down"
                                [disabled]="
                                    i === state.sorted_layers().length - 1
                                "
                                (click)="move($event, layer.id, 'down')"
                            >
                                <app-icon>arrow_downward</app-icon>
                            </button>
                            <button
                                class="text-base"
                                [class]="
                                    confirm_delete() === layer.id
                                        ? 'text-error font-bold'
                                        : 'text-base-content/40 hover:text-error'
                                "
                                title="Delete layer"
                                (click)="remove($event, layer.id)"
                                (blur)="confirm_delete.set('')"
                            >
                                <app-icon>close</app-icon>
                            </button>
                        </div>
                        <input
                            type="range"
                            class="accent-primary mt-1 w-full"
                            min="0"
                            max="1"
                            step="0.05"
                            [value]="layer.opacity"
                            [title]="opacityLabel(layer.opacity)"
                            (click)="$event.stopPropagation()"
                            (input)="setOpacity($event, layer.id)"
                        />
                    </div>
                }
            </div>

            <div class="border-base-300 flex gap-2 border-t p-2">
                <input
                    class="border-base-300 min-w-0 flex-1 rounded border px-2 py-1 text-xs"
                    placeholder="New layer name..."
                    [value]="new_name()"
                    (input)="new_name.set(asValue($event))"
                    (keydown.enter)="add()"
                />
                <button
                    btn
                    class="min-h-0! px-2! py-1! text-xs whitespace-nowrap"
                    (click)="add()"
                >
                    Add
                </button>
            </div>
        </div>
    `,
    imports: [IconComponent],
})
export class LayerPanelComponent {
    public readonly state = inject(EditorStateService);

    public readonly new_name = signal('');
    public readonly confirm_delete = signal('');

    public readonly asValue = (event: Event) =>
        (event.target as HTMLInputElement).value;

    public readonly opacityLabel = (opacity: number) =>
        `Opacity: ${Math.round(opacity * 100)}%`;

    public toggle(
        event: Event,
        id: string,
        updates: { visible?: boolean; locked?: boolean },
    ) {
        event.stopPropagation();
        this.state.updateLayer(id, updates);
    }

    public move(event: Event, id: string, direction: 'up' | 'down') {
        event.stopPropagation();
        this.state.moveLayer(id, direction);
    }

    public setOpacity(event: Event, id: string) {
        event.stopPropagation();
        this.state.updateLayer(id, {
            opacity: Number((event.target as HTMLInputElement).value),
        });
    }

    /** First click arms the delete, second confirms it */
    public remove(event: Event, id: string) {
        event.stopPropagation();
        if (this.confirm_delete() !== id) {
            this.confirm_delete.set(id);
            return;
        }
        this.state.deleteLayer(id);
        this.confirm_delete.set('');
    }

    public add() {
        const name =
            this.new_name().trim() || `Layer ${this.state.layers().length + 1}`;
        this.state.addLayer(name);
        this.new_name.set('');
    }
}
