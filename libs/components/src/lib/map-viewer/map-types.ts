import { InjectionToken, TemplateRef, Type } from '@angular/core';
import { Vec2 } from './map-viewer.class';

export type Point = Vec2;

export interface ViewerStyles {
    [selector: string]: Record<string, string | number>;
}

export interface ViewerFeature {
    location: string | Point;
    content: string | HTMLElement | TemplateRef<any> | Type<any>;
    data?: Record<string, any>;
    track_id?: string;
    full_size?: boolean;
}

export interface ViewerLabel {
    location: string | Point;
    content: string;
}

export interface ViewAction {
    id: string;
    action: string | string[];
    callback: (event: Event, point?: Point) => void;
}

export const MAP_FEATURE_DATA = new InjectionToken<any>(
    'Data for Map Features'
);
