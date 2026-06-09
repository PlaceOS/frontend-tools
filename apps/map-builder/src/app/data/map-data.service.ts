import { Injectable, signal } from '@angular/core';

import { MapData } from './map.class';

@Injectable({
    providedIn: 'root',
})
export class MapDataService {
    private _map_data = signal<MapData[]>([]);
    private _active_map = signal<MapData>(null);
    private _loading = signal<string>('');
    /** List of available map data */
    public readonly maps = this._map_data.asReadonly();
    /** Data for the active map */
    public readonly active_map = this._active_map.asReadonly();
    /** Whether map data is being loaded */
    public readonly loading = this._loading.asReadonly();

    constructor() {
        this.loadMapData();
    }

    public newMap(id: string) {
        const maps = this._map_data();
        this._map_data.set([new MapData({ id, name: 'New Map' }), ...maps]);
        this.saveMapData();
    }

    public loadMapData() {
        this._loading.set('Loading Map Data...');
        const store_keys = new Array(localStorage.length)
            .fill(0)
            .map((_, idx) => localStorage.key(idx))
            .filter((_) => _.includes('MAP.data.'));
        const maps = store_keys.map(
            (_) => new MapData(JSON.parse(localStorage.getItem(_) || '{}')),
        );
        maps.sort((a, b) => a.updated_at - b.updated_at);
        this._map_data.set(maps.reverse());
        this._loading.set('');
    }

    public saveMapData() {
        const maps = this._map_data();
        for (const map of maps) {
            localStorage.setItem(`MAP.data.${map.id}`, JSON.stringify(map));
        }
    }
}
