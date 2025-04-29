//This class models a tile inside the smart city simulation grid.
export class Tile {

    //Identifier of the Tile.
    private title: string = "";

    //Coordinates inside the simulation.
    private coords: Coordinate = { x: 0, y: 0 }; 

    //TODO: ha senso? In alternativa creare struttura di classi Tile/Road/Obstacle
    //Boolean to represent the transitability if the tile.
    private isObstacle: boolean = false;

    //List of the vehicles present in the tile.
    private vehicles: string[] = [];

    //List of the static objects in the tile.
    private staticObjects: string[] = [];

    //Constructor fo the Tile class.
    constructor(title: string, coords: Coordinate, isObstacle: boolean, vehicles: string[], staticObjects: string[]) {
        this.title = title;
        this.coords = coords;
        this.isObstacle = isObstacle;
        this.vehicles = vehicles;
        this.staticObjects = staticObjects;
    }

    //Get the tile's identifier.
    public getTitle(): string {
        return this.title;
    }

    //Get the tile's coordinates.
    public getCoordinates(): Coordinate {
        return this.coords;
    }

    //Get the tile's X coordinate.
    public getX(): number {
        return this.coords.x;
    }

    //Get Tile's Y coordinate.
    public getY(): number {
        return this.coords.y;
    }

    //Add new vehicle to the tile.
    public addVehicle(vehicleID: string) {
        this.vehicles.push(vehicleID);
    }

    //Remove the specified vehicle from the tile.
    public removeVehicle(vehicleID: string) {
        this.vehicles = this.vehicles.filter(ID => ID != vehicleID);
    }

    //Add new static object to the tile.
    public addStaticObject(objectID: string) {
        this.staticObjects.push(objectID);
    }

    //Remove the specified static object from the tile. 
    public removeStaticObject(objectID: string) {
        this.staticObjects = this.staticObjects.filter(ID => ID != objectID);
    }

    //Returns a JSON representation of the tile.
    public toString(): string {
        return JSON.stringify(
            {
                title: this.getTitle(),
                type: this.constructor.name,
                ...Object.getOwnPropertyNames(this)
                    .filter(field =>
                        typeof (this as any)[field] !== 'function'
                    )
                    .reduce((obj: { [field: string]: any }, field) => {
                        obj[field] = (this as any)[field];
                        return obj;
                    }, {})
            }
        );
    }
}