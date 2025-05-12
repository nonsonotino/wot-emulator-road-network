
//Codification of a coordinate inside the simulation grid.
export type Coordinate = {
    x: number;
    y: number;
};

//Coordinate comparison function.
export function areCoordinatesEqual(a: Coordinate, b: Coordinate): boolean {
    return a.x === b.x && a.y === b.y;
}