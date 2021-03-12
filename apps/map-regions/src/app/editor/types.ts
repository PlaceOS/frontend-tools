

export interface MapRegion {
    id?: string;
    /** Name of the region */
    name: string;
    /** Color to display region in on overlay */
    color: string;
    /** Array of points that define the shape of the region */
    points: [number, number][];
    /** Height of the  region */
    height?: number;
    /** Width of the region */
    width?: number;
    /** Maximum capacity of the region */
    capacity: number;
}
