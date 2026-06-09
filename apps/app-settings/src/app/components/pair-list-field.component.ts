import { Component, forwardRef, input, signal } from '@angular/core';
import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR,
    FormsModule,
} from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

type FieldValue<T> = T;
type FieldFn<T> = (_: T) => void;

@Component({
    selector: 'pair-list-field',
    template: `
        @for (item of pair_list(); track item; let i = $index) {
        <div class="flex mb-2 space-x-2">
            <div class="flex flex-col flex-1">
                @if (i === 0) {
                <label>Key</label>
                }
                <mat-form-field
                    no-label
                    appearance="outline"
                    class="h-[3.25rem] w-full"
                >
                    <input
                        matInput
                        [disabled]="!edit_keys()"
                        [ngModel]="item[0]"
                        (ngModelChange)="
                            item[0] = $event; setValue(pair_list())
                        "
                        placeholder="Variable Key"
                    />
                </mat-form-field>
            </div>
            <div class="flex flex-col flex-1">
                @if (i === 0) {
                <label>Value</label>
                }
                <mat-form-field
                    no-label
                    appearance="outline"
                    class="h-[3.25rem] w-full"
                >
                    <input
                        matInput
                        [ngModel]="item[1]"
                        (ngModelChange)="
                            item[1] = $event; setValue(pair_list())
                        "
                        placeholder="Variable Value"
                    />
                </mat-form-field>
            </div>
        </div>
        } @if (add_new()) {
        <button mat-button class="w-full" (click)="addNewPair()">
            Add Key Value Pair
        </button>
        }
    `,
    styles: [``],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PairListFieldComponent),
            multi: true,
        },
    ],
    imports: [MatFormField, MatInput, FormsModule, MatButton],
})
export class PairListFieldComponent implements ControlValueAccessor {
    public readonly edit_keys = input(false);
    public readonly add_new = input(false);
    /** List of set values */
    public readonly pair_list = signal<[string, string][]>([]);

    /** Form control on change handler */
    private _onChange?: FieldFn<Record<string, string>>;
    /** Form control on touch handler */
    private _onTouch?: FieldFn<Record<string, string>>;

    public addNewPair() {
        this.pair_list.update((list) => [...list, ['', '']]);
    }

    /**
     * Update the form field value
     * @param new_value New value to set on the form field
     */
    public setValue(new_value: [string, string][]) {
        const mapping: Record<string, string> = {};
        for (const [key, value] of new_value) {
            if (!key || !value) continue;
            mapping[key] = value;
        }
        if (this._onChange) {
            this._onChange(mapping);
        }
    }

    /**
     * Update local value when form control value is changed
     * @param value The new value for the component
     */
    public writeValue(value: Record<string, string>) {
        const list: [string, string][] = [];
        for (const key in value) {
            list.push([key, value[key]]);
        }
        this.pair_list.set(list);
    }
    public readonly registerOnChange = (fn: any) => (this._onChange = fn);
    public readonly registerOnTouched = (fn: any) => (this._onTouch = fn);
}
