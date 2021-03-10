import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { MapData } from './map.class';

@Injectable({
    providedIn: 'root',
})
export class MapDataService {
    private _map_data = new BehaviorSubject<MapData[]>([]);
    private _active_map = new BehaviorSubject<MapData>(null);
    private _loading = new BehaviorSubject<string>('');
    /** List of available map data */
    public readonly maps$ = this._map_data.asObservable();
    /** Data for the active map */
    public readonly active_map$ = this._active_map.asObservable();
    /** Whether map data is being loaded */
    public readonly loading$ = this._loading.asObservable();

    constructor() {
        this.loadMapData();
    }

    public newMap(id: string) {
        const maps = this._map_data.getValue();
        this._map_data.next([new MapData({ id, name: 'New Map' }), ...maps]);
        this.saveMapData();
    }

    public loadMapData() {
        this._loading.next('Loading Map Data...');
        const store_keys = new Array(localStorage.length)
            .fill(0)
            .map((_, idx) => localStorage.key(idx))
            .filter((_) => _.includes('MAP.data.'));
        const maps = store_keys.map(
            (_) => new MapData(JSON.parse(localStorage.getItem(_) || '{}'))
        )
        maps.sort((a, b) => a.updated_at - b.updated_at)
        this._map_data.next(maps.reverse());
        this._loading.next('');
    }

    public saveMapData() {
        const maps = this._map_data.getValue();
        for (const map of maps) {
            localStorage.setItem(`MAP.data.${map.id}`, JSON.stringify(map));
        }
    }
}
