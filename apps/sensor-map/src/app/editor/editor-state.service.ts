import { Clipboard } from '@angular/cdk/clipboard';
import { Injectable } from '@angular/core';
import {
    downloadFile,
    isChildFrame,
    randomInt,
    retrieveData,
    sendMessage,
} from '@placeos-tools/common';
import { MapPointComponent } from '@placeos-tools/components';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';

const TYPES = ['temperature', 'humidity', 'presense'];

export interface PlaceSensor {
    id?: string;
    name: string;
    type: string;
}

export interface PlaceSensorLocation {
    id?: string;
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
    private _map_url = new BehaviorSubject<string>('');
    private _active_sensor = new BehaviorSubject<PlaceSensor>(null);
    private _embeded = new BehaviorSubject<boolean>(false);

    private _sensor_locations = new BehaviorSubject<PlaceSensorLocation[]>([]);

    private _sensor_list = new BehaviorSubject([]);

    public readonly sensor_details = combineLatest([
        this._sensor_list,
        this._sensor_locations,
    ]).pipe(
        map(([list, locations]) =>
            list.map((_) => {
                const location =
                    locations.find((l) => l.id === _.id) || ({} as any);
                return {
                    ..._,
                    ...location,
                    has_location: location.x || location.y,
                };
            })
        )
    );
    /** List of features to be displayed on the map */
    public readonly features = combineLatest([
        this._sensor_locations,
        this._active_sensor,
    ]).pipe(
        map(([locations, sensor]) => {
            console.log('Locations:', locations, sensor);
            return locations.map((loc) => ({
                location: {
                    x: loc.x,
                    y: loc.y,
                },
                content: MapPointComponent,
                data: {
                    ...loc,
                    active: sensor?.id === loc.id,
                    clicked: () =>
                        this._active_sensor.next(
                            this._sensor_list
                                .getValue()
                                .find((_) => _.id === loc.id)
                        ),
                },
            }));
        }),
        tap((l) => console.log('List:', l))
    );
    /** URL of the map to be displayed */
    public readonly url = this._map_url.asObservable();
    /** List of available sensors */
    public readonly sensor_list = this._sensor_list.asObservable();
    /** Currently selected sensor */
    public readonly active_sensor = this._active_sensor.asObservable();
    /** Whether application is embeded within another */
    public readonly embeded = this._embeded.asObservable();

    constructor(private _clipboard: Clipboard) {
        const is_child = isChildFrame();
        this._embeded.next(is_child);
    }

    public setActive(sensor: PlaceSensor) {
        this._active_sensor.next(sensor);
    }

    /** Update the map URL */
    public setURL(url: string) {
        this._map_url.next(url);
    }

    /** Update the map URL */
    public setSensorPosition(point: { x: number; y: number }) {
        console.log('Point:', point);
        if (!this._active_sensor.getValue()) return;
        const sensor = this._active_sensor.getValue();
        const locations = this._sensor_locations
            .getValue()
            .filter((_) => _.id !== sensor.id);
        this._sensor_locations.next([
            ...locations,
            {
                ...sensor,
                x: +point.x.toFixed(4),
                y: +point.y.toFixed(4),
            },
        ]);
    }

    public async saveMetadata() {
        const embeded = this._embeded.getValue();
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
                JSON.stringify(this.locationsToMap())
            );
        }
    }

    public locationsToMap() {
        const data = this._sensor_locations.getValue();
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
        if (!this._embeded.getValue()) return;
        const sensor_map = await retrieveData('sensor-discovered', true);
        const sensor_list = [];
        for (const id in sensor_map) {
            sensor_list.push({
                ...sensor_map[id],
                id,
            });
        }
        this._sensor_list.next(sensor_list);
        const location_map = await retrieveData('sensor-locations');
        const location_list = [];
        for (const id in location_map) {
            location_list.push({
                ...location_map[id],
                id,
            });
        }
        this._sensor_locations.next(location_list);
    }
}
