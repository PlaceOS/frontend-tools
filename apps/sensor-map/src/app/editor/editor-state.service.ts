import { Clipboard } from '@angular/cdk/clipboard';
import { computed, inject, Injectable, signal } from '@angular/core';
import {
    downloadFile,
    isChildFrame,
    randomInt,
    retrieveData,
    sendMessage,
} from '@placeos-tools/common';
import { MapPointComponent } from '@placeos-tools/components';

export interface PlaceSensor {
    id?: string;
    name: string;
    type: string;
}

export interface PlaceSensorLocation {
    id?: string;
    /** Sensor ID associated with the location */
    sensor_id?: string;
    /** Zone associated with the sensor */
    zone?: string;
    /** Override for sensor name */
    name?: string;
    /** Location of the sensor on the X-axis */
    x: number;
    /** Location of the sensor on the Y-axis */
    y: number;
}

@Injectable({
    providedIn: 'root',
})
export class EditorStateService {
    private _clipboard = inject(Clipboard);

    private _use_url = signal<string>('');
    private _map_url = signal<string>('');
    private _active_sensor = signal<PlaceSensor>(null);
    private _embeded = signal<boolean>(false);

    private _sensor_locations = signal<PlaceSensorLocation[]>([]);

    private _sensor_list = signal<PlaceSensor[]>([]);

    public readonly sensor_details = computed(() =>
        this._sensor_list().map((sensor) => {
            const location: Partial<PlaceSensorLocation> =
                this._sensor_locations().find(
                    (l) => sensorLocationId(l) === sensor.id,
                ) || {};
            return {
                ...sensor,
                ...location,
                id: sensor.id,
                has_location:
                    Number.isFinite(location.x) && Number.isFinite(location.y),
            };
        }),
    );
    /** List of features to be displayed on the map */
    public readonly features = computed(() =>
        this._sensor_locations().map((loc) => ({
            location: {
                x: loc.x + randomInt(50) / 100000,
                y: loc.y + randomInt(50) / 100000,
            },
            content: MapPointComponent,
            data: {
                ...loc,
                active: this._active_sensor()?.id === loc.id,
                clicked: () =>
                    this._active_sensor.set(
                        this._sensor_list().find((_) => _.id === loc.id),
                    ),
            },
        })),
    );
    /** URL of the map to be displayed */
    public readonly url = this._map_url.asReadonly();
    /** List of available sensors */
    public readonly sensor_list = this._sensor_list.asReadonly();
    /** Currently selected sensor */
    public readonly active_sensor = this._active_sensor.asReadonly();
    /** Whether application is embeded within another */
    public readonly embeded = this._embeded.asReadonly();

    constructor() {
        const is_child = isChildFrame();
        this._embeded.set(is_child);
    }

    public setActive(sensor: PlaceSensor) {
        this._active_sensor.set(sensor);
    }

    /** Update the map URL */
    public setURL(url: string, use_url: string = '') {
        this._map_url.set(url);
        this._use_url.set(use_url || url);
    }

    /** Update the map URL */
    public setSensorPosition(point: { x: number; y: number }) {
        console.log('Point:', point);
        if (!this._active_sensor()) return;
        const sensor = this._active_sensor();
        const locations = this._sensor_locations().filter(
            (_) => _.id !== sensor.id,
        );
        this._sensor_locations.set([
            ...locations,
            {
                ...sensor,
                x: +point.x.toFixed(4),
                y: +point.y.toFixed(4),
            },
        ]);
    }

    public async saveMetadata() {
        const embeded = this._embeded();
        if (embeded) {
            await sendMessage({
                type: 'backoffice',
                action: 'metadata',
                name: 'sensor-locations',
                content: this.locationsToMap(),
            });
        } else {
            downloadFile(
                'sensor-location-data.json',
                JSON.stringify(this.locationsToMap()),
            );
        }
    }

    public locationsToMap() {
        const data = this._sensor_locations();
        const data_map = {};
        for (const loc of data) {
            data_map[loc.id] = { ...loc };
            delete data_map[loc.id].id;
        }
        return data_map;
    }

    public copyMetadata() {
        this._clipboard.copy(JSON.stringify(this.locationsToMap(), null, 4));
    }

    public async loadSensorLocations() {
        if (!this._embeded()) return;
        const sensor_map = await retrieveData('sensor-discovered', true);
        const sensor_list = [];
        for (const id in sensor_map) {
            sensor_list.push({
                ...sensor_map[id],
                id,
            });
        }
        this._sensor_list.set(sensor_list);
        const location_map = await retrieveData('sensor-locations');
        const location_list = [];
        for (const id in location_map) {
            location_list.push({
                ...location_map[id],
                id: location_map[id]?.id || location_map[id]?.sensor_id || id,
            });
        }
        this._sensor_locations.set(location_list);
    }
}

function sensorLocationId(location: PlaceSensorLocation) {
    return location.id || location.sensor_id;
}
