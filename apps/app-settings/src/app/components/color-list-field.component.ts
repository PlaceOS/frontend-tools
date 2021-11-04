import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

type FieldValue<T> = T;
type FieldFn<T> = (_: T) => void;

@Component({
    selector: 'color-list-field',
    template: `
        <div
            class="flex mb-2 space-x-2"
            *ngFor="let item of color_list; let i = index"
        >
            <div class="flex flex-col flex-1">
                <label *ngIf="i === 0">Key</label>
                <mat-form-field
                    no-label
                    appearance="outline"
                    class="h-[3.25rem] w-full"
                >
                    <input
                        matInput
                        [disabled]="!edit_keys"
                        [(ngModel)]="item[0]"
                        (ngModelChange)="setValue(color_list)"
                        placeholder="Variable Key"
                    />
                </mat-form-field>
            </div>
            <div class="flex flex-col flex-1">
                <label *ngIf="i === 0">Value</label>
                <mat-form-field
                    no-label
                    appearance="outline"
                    class="h-[3.25rem] w-full"
                >
                    <input
                        matInput
                        type="color"
                        [(ngModel)]="item[1]"
                        (ngModelChange)="setValue(color_list)"
                        placeholder="Variable Value"
                    />
                </mat-form-field>
            </div>
        </div>
        <button
            mat-button
            class="w-full"
            (click)="addNewPair()"
            *ngIf="add_new"
        >
            Add Key Value Pair
        </button>
    `,
    styles: [``],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ColorListFieldComponent),
            multi: true,
        },
    ],
})
export class ColorListFieldComponent implements ControlValueAccessor {
    @Input() public edit_keys = false;
    @Input() public add_new = false;
    /** List of set values */
    public color_list: [string, string][] = [];

    /** Form control on change handler */
    private _onChange?: FieldFn<Record<string, string>>;
    /** Form control on touch handler */
    private _onTouch?: FieldFn<Record<string, string>>;

    public addNewPair() {
        this.color_list.push(['', '']);
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
        this.color_list = list;
    }
    public readonly registerOnChange = (fn: any) => (this._onChange = fn);
    public readonly registerOnTouched = (fn: any) => (this._onTouch = fn);
}
