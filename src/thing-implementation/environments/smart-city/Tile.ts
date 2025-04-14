//This class models a tile inside the smart city simulation grid.
export class Tile {

    //Coordinates inside the simulation.
    private x : number = 0;
    private y : number = 0;

    //List of the vehicles present in the tile.
    private vehicles: string[] = [];

    //List of the static objects in the tile.
    private staticObjects : string[] = [];

    //Constructor fo the Tile class.
    constructor(x : number, y : number) {
        //Initialization of the tile position.
        this.x = x;
        this.y = y;
    }

    //Get the tile's X coordinate.
    public getX() : number {
        return this.x;
    }

    //Get Tile's Y coordinate.
    public getY() : number {
        return this.y;
    }
}