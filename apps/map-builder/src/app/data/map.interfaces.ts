
import { HashMap } from '@placeos-tools/common';

export type MapElementNodeType = 'polygon' | 'point' | 'label' | 'image' | 'reference';

export interface Point {
    readonly x: number;
    readonly y: number;
}

export interface MapElementNode {
    id: string;
    layer: string;
    type: MapElementNodeType;
    coordinates: Point[];
    styles: HashMap<string | number>;
}
