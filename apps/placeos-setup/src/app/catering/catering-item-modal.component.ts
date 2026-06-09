import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { Component, computed, inject, output, signal } from '@angular/core';
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import {
    MatChip,
    MatChipInput,
    MatChipInputEvent,
    MatChipRemove,
} from '@angular/material/chips';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogClose,
} from '@angular/material/dialog';
import {
    DialogEvent,
    openGenericModal,
    randomInt,
} from '@placeos-tools/common';

import {
    MatAutocomplete,
    MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption } from '@angular/material/select';
import { IconComponent } from '../../../../../libs/components/src/lib/icon.component';
import { CounterComponent } from '../components/counter.component';
import { CateringItem } from './catering-item.class';

export async function openCateringItemModal(
    data: CateringItemModalData,
    dialog: MatDialog,
) {
    return openGenericModal(CateringItemModalComponent, data, dialog);
}

export interface CateringItemModalData {
    item: CateringItem;
    categories?: string[];
}

@Component({
    selector: 'catering-item-modal',
    template: `
        <header
            class="flex items-center justify-between border-b border-gray-200 p-2 dark:border-neutral-500"
        >
            <h3 class="p-2 font-medium">
                {{ item().id ? 'Edit' : 'Add' }} Item
            </h3>
            @if (!loading()) {
                <button mat-icon-button mat-dialog-close>
                    <app-icon>close</app-icon>
                </button>
            }
        </header>
        @if (form() && !loading()) {
            <form class="max-h-[65vh] overflow-auto p-4" [formGroup]="form()">
                @if (form.controls.name) {
                    <div class="flex flex-col">
                        <label
                            for="title"
                            [class.error]="
                                form.controls.name.invalid &&
                                form.controls.name.touched
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
                @if (form.controls.category) {
                    <div class="flex flex-col">
                        <label
                            for="category"
                            [class.error]="
                                form.controls.category.invalid &&
                                form.controls.category.touched
                            "
                        >
                            Category<span required>*</span>:
                        </label>
                        <mat-form-field appearance="outline">
                            <input
                                matInput
                                name="category"
                                placeholder="Category"
                                formControlName="category"
                                [matAutocomplete]="auto"
                            />
                            <mat-error>Category is required</mat-error>
                        </mat-form-field>
                    </div>
                }
                @if (form.controls.tags) {
                    <div class="flex flex-col">
                        <label
                            for="tags"
                            [class.error]="
                                form.controls.tags.invalid &&
                                form.controls.tags.touched
                            "
                            i18n="@@tagsLabel"
                        >
                            Tags:
                        </label>
                        <mat-form-field appearance="outline">
                            <mat-chip-list #chipList aria-label="Item Tags">
                                @for (tag of tag_list(); track tag) {
                                    <mat-chip
                                        [selectable]="true"
                                        [removable]="true"
                                        (removed)="removeTag(tag)"
                                    >
                                        {{ tag }}
                                        <app-icon
                                            matChipRemove
                                            [icon]="{
                                                class: 'material-icons',
                                                content: 'close',
                                            }"
                                        />
                                    </mat-chip>
                                }
                                <input
                                    name="tags"
                                    placeholder="Zone tags..."
                                    i18n-placeholder="@@zoneTagsPlaceholder"
                                    [matChipInputFor]="chipList"
                                    [matChipInputSeparatorKeyCodes]="
                                        separators()
                                    "
                                    [matChipInputAddOnBlur]="true"
                                    (matChipInputTokenEnd)="addTag($event)"
                                />
                            </mat-chip-list>
                        </mat-form-field>
                    </div>
                }
                @if (form.controls.description) {
                    <div class="flex flex-col">
                        <label for="description">Description:</label>
                        <mat-form-field appearance="outline">
                            <textarea
                                matInput
                                name="description"
                                placeholder="Item Description"
                                formControlName="description"
                            ></textarea>
                        </mat-form-field>
                    </div>
                }
                @if (form.controls.unit_price) {
                    <div class="flex flex-col">
                        <label
                            for="title"
                            [class.error]="
                                form.controls.unit_price.invalid &&
                                form.controls.unit_price.touched
                            "
                        >
                            Unit Price<span required>*</span>:
                        </label>
                        <mat-form-field appearance="outline">
                            <input
                                matInput
                                name="unit-price"
                                type="number"
                                placeholder="Unit Price"
                                formControlName="unit_price"
                            />
                            <mat-error>Unit Price is required</mat-error>
                        </mat-form-field>
                    </div>
                }
                <div class="flex items-center">
                    <label class="w-28 min-w-0 flex-none">Accept Points?</label>
                    <mat-checkbox formControlName="accept_points">{{
                        form().get('accept_points')?.value ? 'No' : 'Yes'
                    }}</mat-checkbox>
                </div>
                <div class="flex items-center">
                    <label class="w-24 min-w-0 flex-1">Discount Cap</label>
                    <a-counter
                        class="rounded border border-gray-200"
                        formControlName="discount_cap"
                        [min]="0"
                        [max]="100"
                        [step]="5"
                        [render_fn]="renderPercent"
                    />
                </div>
            </form>
        } @else {
            <div class="flex w-64 flex-col items-center space-y-2 p-8">
                <mat-spinner diameter="32" />
                <p>Saving catering item...</p>
            </div>
        }
        @if (!loading()) {
            <footer
                class="flex items-center justify-center border-t border-solid border-gray-300 p-2 dark:border-neutral-500"
            >
                <button
                    mat-button
                    class="w-32"
                    [disabled]="!form.dirty"
                    (click)="saveChanges()"
                >
                    Save
                </button>
            </footer>
        }
        <mat-autocomplete #auto="matAutocomplete">
            @for (option of categories(); track option) {
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
    imports: [
        MatIconButton,
        MatDialogClose,
        IconComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormField,
        MatInput,
        MatError,
        MatAutocompleteTrigger,
        MatChip,
        MatChipRemove,
        MatChipInput,
        MatCheckbox,
        CounterComponent,
        MatButton,
        MatAutocomplete,
        MatOption,
    ],
})
export class CateringItemModalComponent {
    private readonly _data = signal(
        inject<CateringItemModalData>(MAT_DIALOG_DATA),
    );

    /** Emitter for events on the modal */
    public readonly event = output<DialogEvent>();
    /** Current item details */
    public readonly item = computed(
        () => this._data().item || new CateringItem(),
    );
    /** Form fields for item */
    public form = signal(
        new FormGroup({
            name: new FormControl(this.item().name || '', [
                Validators.required,
            ]),
            description: new FormControl(this.item().description || ''),
            category: new FormControl(this.item().category || '', [
                Validators.required,
            ]),
            unit_price: new FormControl(this.item().unit_price, [
                Validators.required,
            ]),
            tags: new FormControl(this.item().tags || []),
            accept_points: new FormControl(this.item().accept_points || false),
            discount_cap: new FormControl(this.item().discount_cap || 0),
        }),
    );
    /** Whether changes are being saved */
    public readonly loading = signal(false);
    /** List of separator characters for tags */
    public readonly separators = signal([ENTER, COMMA, SPACE]);

    /** List of available categories */
    public readonly categories = computed(() => {
        return this._data().categories || [];
    });

    public readonly tag_list = computed(() => {
        return this.form().controls.tags.value;
    });

    public renderPercent(value: number = 0) {
        return `${value}%`;
    }

    /**
     * Add a tag to the list of tags for the item
     * @param event Input event
     */
    public addTag(event: MatChipInputEvent): void {
        if (!this.form || !this.form().controls.tags) return;
        this.form().controls.tags.markAsDirty();
        const input = event.input;
        const value = event.value;
        const tag_list = this.tag_list();
        if ((value || '').trim()) {
            tag_list.push(value);
            this.form().controls.tags.setValue(tag_list);
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }
    }

    /**
     * Remove tag from the list
     * @param existing_tag Tag to remove
     */
    public removeTag(existing_tag: string): void {
        if (!this.form || !this.form().controls.tags) return;
        const tag_list = this.tag_list();
        this.form().controls.tags.markAsDirty();
        const index = tag_list.indexOf(existing_tag);

        if (index >= 0) {
            tag_list.splice(index, 1);
            this.form().controls.tags.setValue(tag_list);
        }
    }

    public saveChanges() {
        this.loading.set(true);
        this.event.emit({
            reason: 'done',
            metadata: {
                item: new CateringItem({
                    ...this.item(),
                    id: this.item().id || `item-${randomInt(9999_9999)}`,
                    ...this.form().value,
                }),
            },
        });
    }
}
