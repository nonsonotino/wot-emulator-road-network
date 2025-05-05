import Servient from "@node-wot/core";
import { Thing } from "../../Thing";
import { Car } from "../../things/smart-city/Car"; // Import the Car type
import { Coordinate } from "./Coordinate";

//The SmartCity class models an environment representing the road network of smart city.
//It aims to simulate the movement of a set of cars inside itself keeping track of their positions
//and the interactions they may have with other members of the simulation.
export class SmartCity extends Thing {

    //Smart city identifier.
    private title: string = "";

    //Dimensions of the simulation grid.
    private gridHeight: number = 0;
    private gridWidth: number = 0;

    //Obstacles positions.
    private obstacles: boolean[][] = [];

    //List of the vehicles present in the simulation.
    private vehicles: Map<string, Car> = new Map();

    //TODO traffic light and licenses plates reade lists

    //List of the direcrions in which a car can move.
    static directions = [
        { x: 0, y: -1 }, // Up
        { x: 1, y: 0 }, // Right
        { x: 0, y: 1 }, // Down
        { x: -1, y: 0 } // Left
    ];

    // Base structure of the city's TD.
    private static initBase: WoT.ExposedThingInit = {
        "@context": "https://www.w3.org/2019/wot/td/v1",
        "@type": "Environment",
        "description": "An environment representing a smart city's road network.",
        "forms": [
            {
                "href": "environment",
                "op": ["readproperty", "writeproperty", "observeproperty"],
                "contentType": "application/json"
            }
        ],
        "properties": {
            
        },
        "events": {

        }
    };

    //TODO: REWRITE METHOD WITHOUT TILE
    //Smart city constructor.
    constructor(servient: Servient, init: WoT.ExposedThingInit) {
        super(servient, init, SmartCity.initBase);

        this.configureProperties(init);
        this.setPropertiesDefaultHandler(init);

        //TODO properties urls
    }

    //Returns SmartCity identifier.
    public getTitle(): string {
        return this.title;
    }

    //Returns a random valid neighbor of the specified coordinates.
    private getValidNeighbor(coords: Coordinate, prevCell: Coordinate): Coordinate {
        //Filter valid neighbors based on grid boundaries and obstacles.
        const validNeighbors = SmartCity.directions
                .map(({ x, y }) => ({ x: coords.x + x, y: coords.y + y }))
                .filter(({ x, y }) => x >= 0 && y >= 0 && x < this.gridWidth && y < this.gridHeight //Check if cell is inside boudaries.
                    && this.obstacles[x][y] == false //Check if the tile is not an obstacle.
                    && (prevCell.x != x && prevCell.y != y)); //Check if tile is not the last visited cell.

        const randomNeighbor = validNeighbors[Math.floor(Math.random() * validNeighbors.length)];

        return randomNeighbor;
    }

    //Move the specified car in an avilable tile of the grid.
    public async moveCar(carId: string): Promise<void> {
        const car: Car = this.vehicles.get(carId) as Car;
        const newPosition = this.getValidNeighbor(car.getCoordinates() as Coordinate, car.getLastVisitedCell());
        this.vehicles.get(carId)?.moveTo(newPosition);

        //TODO: send event to the eventual license plate reader of the presence of a new car.
    }

    //Update function.
    public update(deltaTime: number): void {
        throw new Error("Method not implemented.");
    }

    //TODO: implement
    //Returns a JSON representation of the SmartCity.
    public toString(): string {
        return "";
    }
}

//TODO: is it necessary?
//Factory function to create a new SmartCity istance
export function create(servient: Servient, init: WoT.ExposedThingInit): SmartCity {
    return new SmartCity(servient, init);
}