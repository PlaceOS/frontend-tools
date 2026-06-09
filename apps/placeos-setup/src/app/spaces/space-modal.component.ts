import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { OrganisationService } from '../organisation/organisation.service';
import { Space } from './spaces.service';

@Component({
    standalone: false,
    selector: 'space-modal',
    template: `
        <div
          class="absolute inset-0 bg-white dark:bg-neutral-600 dark:text-white flex flex-col"
          >
          <header
            class="w-full bg-blue-300 dark:bg-neutral-700 border-b border-gray-200 dark:border-neutral-500"
            >
            <div class="mx-auto w-[640px] relative p-4 text-center">
              <div class="font-medium">
                {{ form.value.id ? 'Edit' : 'New' }} Room
              </div>
              @if (!loading) {
                <button
                  mat-icon-button
                  mat-dialog-close
                  class="absolute top-1/2 right-0 -translate-y-1/2"
                  >
                  <app-icon>close</app-icon>
                </button>
              }
            </div>
          </header>
          @if (!loading) {
            <main
              class="mx-auto w-[640px] p-4 flex-1 h-1/2 overflow-auto"
              [formGroup]="form"
              >
              <div class="w-full">
                <label for="room-id">Room ID</label>
                <mat-form-field appearance="outline" class="w-full">
                  <input
                    matInput
                    name="room-id"
                    formControlName="room_id"
                    placeholder="Room ID"
                    />
                  <mat-hint>
                    Map ID associated with the map
                  </mat-hint>
                  <mat-error>Room ID is required</mat-error>
                </mat-form-field>
              </div>
              <div class="w-full">
                <label for="display-name">Display Name</label>
                <mat-form-field appearance="outline" class="w-full">
                  <input
                    matInput
                    name="display-name"
                    formControlName="display_name"
                    placeholder="Level Display Name"
                    />
                  <mat-hint>
                    Name that will be displayed to users
                  </mat-hint>
                  <mat-error>Display name is required</mat-error>
                </mat-form-field>
              </div>
              <div class="w-full">
                <label for="name">
                  Name <span class="text-pending">*</span>
                </label>
                <mat-form-field appearance="outline" class="w-full">
                  <input
                    matInput
                    name="name"
                    formControlName="name"
                    placeholder="Level Name"
                    />
                  <mat-hint>
                    Organisational name for the space
                  </mat-hint>
                  <mat-error>Name is required</mat-error>
                </mat-form-field>
              </div>
              <div class="w-full">
                <label for="building">Building</label>
                <mat-form-field appearance="outline" class="w-full">
                  <mat-select
                    name="building"
                    formControlName="building_id"
                    placeholder="Building"
                    >
                    @for (item of building_list | async; track item) {
                      <mat-option
                        [value]="item.id"
                        >
                        {{ item.display_name || item.name }}
                      </mat-option>
                    }
                  </mat-select>
                  <mat-hint>
                    Building that the level resides in
                  </mat-hint>
                  <mat-error>Building is required</mat-error>
                </mat-form-field>
              </div>
              <div class="w-full">
                <label for="level">Level</label>
                <mat-form-field appearance="outline" class="w-full">
                  <mat-select
                    name="level"
                    formControlName="level_id"
                    placeholder="Level"
                    >
                    @for (item of level_list | async; track item) {
                      <mat-option
                        [value]="item.id"
                        >
                        {{ item.display_name || item.name }}
                      </mat-option>
                    }
                  </mat-select>
                  <mat-hint>
                    Building Level that the space resides in
                  </mat-hint>
                  <mat-error>Building Level is required</mat-error>
                </mat-form-field>
              </div>
              <div class="w-full">
                <label for="sensor-brand">Sensor Brand</label>
                <mat-form-field appearance="outline" class="w-full">
                  <input
                    matInput
                    name="sensor-brand"
                    formControlName="sensor_brand"
                    placeholder="Sensor Brand"
                    />
                  <mat-hint>
                    Brand of sensors that are used in the room
                  </mat-hint>
                  <mat-error>Sensor brand is required</mat-error>
                </mat-form-field>
              </div>
              <div class="w-full">
                <label for="display-name">Room Features</label>
                <mat-form-field appearance="outline" class="w-full">
                  <mat-chip-list
                    #featureList
                    aria-label="Room Features"
                    >
                    @for (item of form.value.features; track item) {
                      <mat-chip
                                    (removed)="
                                        remove(item, form.get('features'))
                                    "
                        >
                        {{ item }}
                        <button matChipRemove>
                          <app-icon>cancel</app-icon>
                        </button>
                      </mat-chip>
                    }
                    <input
                      placeholder="New feature..."
                      [matChipInputFor]="featureList"
                                    [matChipInputSeparatorKeyCodes]="
                                        separatorKeysCodes
                                    "
                      [matChipInputAddOnBlur]="addOnBlur"
                                    (matChipInputTokenEnd)="
                                        add($event, form.get('features'))
                                    "
                      />
                  </mat-chip-list>
                  <mat-hint>
                    Resources in the room that are available for
                    users.
                  </mat-hint>
                  <mat-error>Display name is required</mat-error>
                </mat-form-field>
              </div>
              <div class="w-full">
                <label for="whi">Whitelist User Groups</label>
                <mat-form-field appearance="outline" class="w-full">
                  <mat-chip-list
                    #groupList
                    aria-label="Whitelist User Groups"
                    >
                    @for (
                      item of form.value.whitelist_groups
                      ; track
                      item) {
                      <mat-chip
                                    (removed)="
                                        remove(
                                            item,
                                            form.get('whitelist_groups')
                                        )
                                    "
                        >
                        {{ item }}
                        <button matChipRemove>
                          <app-icon>cancel</app-icon>
                        </button>
                      </mat-chip>
                    }
                    <input
                      placeholder="New group..."
                      [matChipInputFor]="groupList"
                                    [matChipInputSeparatorKeyCodes]="
                                        separatorKeysCodes
                                    "
                      [matChipInputAddOnBlur]="addOnBlur"
                                    (matChipInputTokenEnd)="
                                        add(
                                            $event,
                                            form.get('whitelist_groups')
                                        )
                                    "
                      />
                  </mat-chip-list>
                  <mat-hint>
                    Users groups to limit access to this room
                  </mat-hint>
                  <mat-error>Display name is required</mat-error>
                </mat-form-field>
              </div>
              <div class="w-full py-2">
                <mat-checkbox
                  name="visitors"
                  formControlName="allow_visitors"
                  >
                  Are visitors allow to the building?
                </mat-checkbox>
              </div>
              <div class="w-full py-2">
                <mat-checkbox
                  name="catering"
                  formControlName="catering_available"
                  >
                  Is catering available in the building?
                </mat-checkbox>
              </div>
              <div class="w-full py-2">
                <mat-checkbox
                  name="requires-approval"
                  formControlName="requires_approval"
                  >
                  Is approval required for bookings?
                </mat-checkbox>
              </div>
              <div class="w-full py-2">
                <mat-checkbox
                  name="visitors"
                  formControlName="visitors"
                  >
                  Are visitors allow to use this room?
                </mat-checkbox>
              </div>
              <div class="w-full py-2">
                <mat-checkbox
                  name="auto-release"
                  formControlName="auto_release"
                  >
                  Should bookings be released if not checked into?
                </mat-checkbox>
              </div>
              @if (form.value.auto_release) {
                <div class="w-full">
                  <label for="auto-release-delay"
                    >Auto-release delay</label
                    >
                    <mat-form-field appearance="outline" class="w-full">
                      <input
                        matInput
                        name="auto-release-delay"
                        type="number"
                        formControlName="auto_release_delay"
                        placeholder="Auto-release Delay"
                        />
                      <mat-hint>
                        Duration in minutes after the start of the
                        booking
                      </mat-hint>
                      <mat-error
                        >Auto-release delay is required</mat-error
                        >
                      </mat-form-field>
                    </div>
                  }
                  <div class="w-full py-2">
                    <mat-checkbox
                      name="recurrence"
                      formControlName="recurrence"
                      >
                      Should recurring bookings be allowed in this room?
                    </mat-checkbox>
                  </div>
                  @if (form.value.recurrence) {
                    <div class="w-full">
                      <label for="max-recurrences">Max Recurrences</label>
                      <mat-form-field appearance="outline" class="w-full">
                        <input
                          matInput
                          name="max-recurrences"
                          type="number"
                          formControlName="max_recurrence"
                          placeholder="Max Recurrences"
                          />
                        <mat-hint>
                          Number of recurrence instances allow for a
                          booking
                        </mat-hint>
                        <mat-error>Max recurrences is required</mat-error>
                      </mat-form-field>
                    </div>
                  }
                  <div class="w-full py-2">
                    <mat-checkbox name="all-day" formControlName="all_day">
                      Should all day bookings be allowed in this room?
                    </mat-checkbox>
                  </div>
                  <div class="w-full py-2">
                    <mat-checkbox name="images" formControlName="images">
                      Does this room have images that can be displayed to
                      users?
                    </mat-checkbox>
                  </div>
                </main>
                <footer
                  class="w-full bg-blue-300 dark:bg-neutral-700 border-t border-gray-200 dark:border-neutral-500"
                  >
                  <div class="mx-auto w-[640px] relative p-4">
                    <button mat-button (click)="save()" class="w-32">
                      Save
                    </button>
                  </div>
                </footer>
              } @else {
                <div class="mx-auto w-[640px] p-4 flex-1 h-1/2">
                  <mat-spinner></mat-spinner>
                  <p>Saving space data...</p>
                </div>
              }
            </div>
        `,
    styles: [``],

})
export class SpaceModalComponent {
    @Output() public readonly onSave = new EventEmitter<Partial<Space>>();
    public loading = false;
    public addOnBlur = true;

    public readonly separatorKeysCodes = [ENTER, COMMA] as const;
    public readonly building_list = this._org.buildings;
    public readonly level_list = this._org.levels;
    public readonly form = new FormGroup({
        id: new FormControl(''),
        room_id: new FormControl('', [Validators.required]),
        building_id: new FormControl('', [Validators.required]),
        level_id: new FormControl('', [Validators.required]),
        display_name: new FormControl(''),
        name: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.email]),
        capacity: new FormControl(2),
        type: new FormControl(''),
        features: new FormControl([]),
        whitelist_groups: new FormControl([]),
        pets_allowed: new FormControl(false),
        allow_visitors: new FormControl(false),
        catering_available: new FormControl(false),
        requires_approval: new FormControl(false),
        visitors: new FormControl(false),
        auto_release: new FormControl(false),
        auto_release_delay: new FormControl(15),
        sensor_brand: new FormControl(''),
        recurrence: new FormControl(false),
        max_recurrence: new FormControl(0),
        all_day: new FormControl(false),
        images: new FormControl(false),
    });

    public add(event: MatChipInputEvent, control: FormControl<string[]>): void {
        const value = (event.value || '').trim();
        if (value) control.value.push(value);
        event.chipInput!.clear();
    }

    public remove(item: string, control: FormControl<string[]>): void {
        const index = control.value.indexOf(item);
        if (index >= 0) control.value.splice(index, 1);
    }

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private _data: Space,
        private _org: OrganisationService
    ) {
        this.form.patchValue(this._data as any);
    }

    public save() {
        this.form.markAllAsTouched();
        if (!this.form.valid) return;
        this.loading = true;
        this.onSave.emit(this.form.getRawValue() as any);
    }
}
