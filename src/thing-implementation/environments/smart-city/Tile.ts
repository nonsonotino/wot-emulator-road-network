//This class models a tile inside the smart city simulation grid.
export class Tile {

    //Coordinates inside the simulation.
    private x : number = 0;
    private y : number = 0;

    //List of the vehicles present in the tile.
    private vehicles: string[] = [];

    //List of the static objects in the tile.
    private staticObjects : string[] = [];

}