
import { randomInt } from '@placeos-tools/common';
import { formatDistanceToNow } from 'date-fns';

import { MapElementNode } from './map.interfaces';

export class MapData {
    /** Unique identifier for map */
    public readonly id: string;
    /** Unix epoch of the creation time of the map data */
    public readonly created_at: number;
    /** Unix epoch of the last saved change time of the map data */
    public readonly updated_at: number;
    /** User readable name for the map */
    public readonly name: string;
    /** List of nodes that make up the map */
    public readonly nodes: readonly MapElementNode[];

    /** Display string for creation time from now */
    public get created(): string {
        return formatDistanceToNow(this.created_at);
    }
    /** Display string for last saved change time from now */
    public get last_edited(): string {
        return formatDistanceToNow(this.updated_at);
    }

    constructor(raw_data: Partial<MapData>) {
        this.id = raw_data.id || `map-data-${randomInt(999_999_999, 100_000_000)}`;
        this.created_at = raw_data.created_at || new Date().valueOf();
        this.updated_at = raw_data.updated_at || new Date().valueOf();
        this.name = raw_data.name || '';
        this.nodes = raw_data.nodes || [];
    }
}
