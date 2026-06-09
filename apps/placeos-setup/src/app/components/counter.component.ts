import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { IconComponent } from '../../../../../libs/components/src/lib/icon.component';

@Component({
    selector: 'a-counter',
    template: `
        <div
            counter
            class="flex items-center text-base"
            (window:keydown.shift)="shift_key.set(true)"
            (window:keydown.control)="ctrl_key.set(true)"
            (window:keydown.meta)="ctrl_key.set(true)"
            (window:keyup.shift)="shift_key.set(false)"
            (window:keyup.control)="ctrl_key.set(false)"
            (window:keyup.meta)="ctrl_key.set(false)"
        >
            <button
                mat-icon-button
                name="remove"
                type="button"
                [disabled]="!value() || value() === min()"
                (click)="remove()"
            >
                <app-icon>remove</app-icon>
            </button>
            <div value class="p-1 text-center">
                {{ (render_fn() ? render_fn()!(value()) : value()) || '0' }}
            </div>
            <button
                mat-icon-button
                name="add"
                type="button"
                [disabled]="value() === max()"
                (click)="add()"
            >
                <app-icon>add</app-icon>
            </button>
        </div>
    `,
    styles: [
        `
            [value] {
                min-width: 3em;
            }
        `,
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            /* istanbul ignore next */
            useExisting: forwardRef(() => CounterComponent),
            multi: true,
        },
    ],
    imports: [MatIconButton, IconComponent],
})
export class CounterComponent implements ControlValueAccessor {
    /** Size of a single step */
    public readonly step = input(1);
    /** Maximum amount for the counter */
    public readonly max = input(10);
    /** Minimum amount for the counter */
    public readonly min = input(0);
    /** Custom function for rendering the counter value */
    public readonly render_fn = input<((v: number) => string) | undefined>();
    /** Current value of the counter */
    public readonly value = signal(0);
    /** Whether shift key is being held by the user */
    public readonly shift_key = signal(false);
    /** Whether control key is being held by the user */
    public readonly ctrl_key = signal(false);

    /** Form control on change handler */
    private _onChange: (_: number) => void;
    /** Form control on touch handler */
    private _onTouch: (_: number) => void;

    /**
     * Add the `step` to the current value
     */
    public add() {
        let value = this.value();
        if (!value) {
            value = this.min() || 0;
        }
        const step = this.ctrl_key()
            ? 100 * this.step()
            : this.shift_key()
            ? 10 * this.step()
            : this.step() || 1;
        value += step;
        if (value > this.max()) {
            value = this.max() || 10;
        }
        this.setValue(value);
    }

    /** Remove the `step` from the current value */
    public remove() {
        let value = this.value();
        if (!value) {
            value = this.min() || 0;
        }
        const step = this.ctrl_key()
            ? 100 * this.step()
            : this.shift_key()
            ? 10 * this.step()
            : this.step() || 1;
        value -= step;
        if (value < this.min()) {
            value = this.min() || 0;
        }
        this.setValue(value);
    }

    /**
     * Update the form field value
     * @param new_value New value to set on the form field
     */
    public setValue(new_value: number): void {
        this.value.set(new_value);
        /* istanbul ignore else */
        if (this._onChange) {
            this._onChange(new_value);
        }
    }

    /**
     * Update local value when form control value is changed
     * @param value The new value for the component
     */
    public writeValue(value: number) {
        this.value.set(value);
    }

    /* istanbul ignore next */
    /**
     * Registers a callback function that is called when the control's value changes in the UI.
     * @param fn The callback function to register
     */
    public registerOnChange(fn: (_: number) => void): void {
        this._onChange = fn;
    }

    /* istanbul ignore next */
    /**
     * Registers a callback function is called by the forms API on initialization to update the form model on blur.
     * @param fn The callback function to register
     */
    public registerOnTouched(fn: (_: number) => void): void {
        this._onTouch = fn;
    }
}
