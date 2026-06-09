import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DialogEvent } from 'libs/common/src/lib/types';
import { openGenericModal, randomInt } from 'libs/common/src/lib/general';

import { CateringItem } from './catering-item.class';
import { CateringOption } from './catering.interfaces';

export interface CateringItemOptionModalData {
    parent: CateringItem;
    option: CateringOption;
    types: string[];
}

export async function openCateringItemOptionModal(
    data: CateringItemOptionModalData,
    dialog: MatDialog
) {
    return openGenericModal(CateringItemOptionModalComponent, data, dialog);
}

@Component({
    standalone: false,
    selector: 'catering-option-modal',
    template: `
        <header
          class="flex items-center p-2 justify-between border-b border-gray-200 dark:border-neutral-500"
          >
          <h3 class="p-2 font-medium">
            {{ option.id ? 'Edit' : 'Add' }} Item Option
          </h3>
          @if (!loading) {
            <button mat-icon-button mat-dialog-close>
              <app-icon>close</app-icon>
            </button>
          }
        </header>
        @if (form && !loading) {
          <form
            class="p-4 overflow-auto"
            [formGroup]="form"
            >
            @if (form.controls.name) {
              <div class="flex flex-col">
                <label
                  for="title"
                    [class.error]="
                        form.controls.name.invalid && form.controls.name.touched
                    "
                  >
                  Name<span required>*</span>:
                </label>
                <mat-form-field appearance="outline">
                  <input
                    matInput
                    name="name"
                    placeholder="Item name"
                    formControlName="name"
                    />
                  <mat-error>Name is required</mat-error>
                </mat-form-field>
              </div>
            }
            @if (form.controls.group) {
              <div class="flex flex-col">
                <label
                  for="group"
                    [class.error]="
                        form.controls.group.invalid &&
                        form.controls.group.touched
                    "
                  >
                  Type<span required>*</span>:
                </label>
                <mat-form-field appearance="outline">
                  <input
                    matInput
                    name="group"
                    placeholder="Type of option e.g. Number of sugars"
                    formControlName="group"
                    [matAutocomplete]="auto"
                    />
                  <mat-error>Type is required</mat-error>
                </mat-form-field>
              </div>
            }
            @if (form.controls.unit_price) {
              <div class="flex flex-col">
                <label for="title">Unit Price:</label>
                <mat-form-field appearance="outline">
                  <input
                    matInput
                    name="unit-price"
                    type="number"
                    placeholder="Unit Price"
                    formControlName="unit_price"
                    />
                </mat-form-field>
              </div>
            }
            @if (form.controls.multiple) {
              <div class="flex flex-col">
                <mat-checkbox name="multiple" formControlName="multiple">
                  Can select multiple of type
                </mat-checkbox>
              </div>
            }
          </form>
        } @else {
          <div loading class="flex flex-col items-center p-8 space-y-2 w-64">
            <mat-spinner diameter="32"></mat-spinner>
            <p>Saving catering item option...</p>
          </div>
        }
        @if (!loading) {
          <footer
            class="flex p-2 items-center justify-center border-t border-solid border-gray-300 dark:border-neutral-500"
            >
            <button mat-button class="w-32" [disabled]="!form.dirty" (click)="saveChanges()">
              Save
            </button>
          </footer>
        }
        <mat-autocomplete #auto="matAutocomplete">
          @for (option of types; track option) {
            <mat-option [value]="option">
              {{ option }}
            </mat-option>
          }
        </mat-autocomplete>
        `,
    styles: [
        `
            mat-form-field {
                width: 24rem;
            }
        `,
    ],

})
export class CateringItemOptionModalComponent {
    /** Emitter for events on the modal */
    @Output() public event = new EventEmitter<DialogEvent>();
    /** Form fields for item */
    public form = new FormGroup({
        name: new FormControl(this.option.name || '', [Validators.required]),
        group: new FormControl(this.option.group || '', [Validators.required]),
        unit_price: new FormControl(this.option.unit_price),
        multiple: new FormControl(!!this.option.multiple, []),
    });
    /** Whether changes are being saved */
    public loading = false;

    /** Current item details */
    public get option(): CateringOption {
        return this._data.option;
    }

    /** List of available categories */
    public get types(): string[] {
        return this._data.types || [];
    }

    constructor(
        @Inject(MAT_DIALOG_DATA) private _data: CateringItemOptionModalData
    ) {}

    public saveChanges() {
        this.loading = true;
        const new_option = {
            ...this.option,
            id: this.option.id || `option-${randomInt(9999_9999)}`,
            ...this.form.value,
        } as CateringOption;
        this.event.emit({
            reason: 'done',
            metadata: {
                item: new CateringItem({
                    ...this._data.parent,
                    options: this._data.parent.options
                        .filter((i) => i.id !== new_option.id)
                        .concat([new_option]),
                }),
            },
        });
    }
}
