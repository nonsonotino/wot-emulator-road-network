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

    //Smart city constructor.
    constructor(servient: Servient, init: WoT.ExposedThingInit) {
        super(servient, init, SmartCity.initBase);

        this.configureProperties(init);
        this.setPropertiesDefaultHandler(init);

        this.gridHeight = this.obstacles.length;
        this.gridWidth = this.obstacles[0].length;

        //TODO properties urls
    }

    //Returns SmartCity identifier.
    public getTitle(): string {
        return this.title;
    }

    //Returns a random valid neighbor of the specified coordinates.
    private getValidNeighbor(coords: Coordinate, prevCell: Coordinate): Coordinate {
        
        //Filter valid neighbors based on grid boundaries and obstacles.
        const validNeighbors: Coordinate[] = [];

        for (const direction of SmartCity.directions) {
            const newX = coords.x + direction.x;
            const newY = coords.y + direction.y;

            if (newX >= 0 && newX < this.gridWidth && newY >= 0 && newY < this.gridHeight && this.obstacles[newY][newX] && (newX !== prevCell.x || newY !== prevCell.y)) {
                validNeighbors.push({ x: newX, y: newY });
            }
        }

        return validNeighbors[Math.floor(Math.random() * validNeighbors.length)];
    }

    //Move the specified car in an avilable tile of the grid.
    public async moveCar(car: Car): Promise<void> {
        console.clear();

        const newPosition = this.getValidNeighbor(car.getCoordinates() as Coordinate, car.getLastVisitedCell());
        car.moveTo(newPosition);

        //Print the matrix with the car position.
        for (let y = 0; y < this.gridHeight; y++) {
            let rowStr = "";
            for (let x = 0; x < this.gridWidth; x++) {
              if (x === newPosition.x && y === newPosition.y) {
                rowStr += "* ";
              } else {
                rowStr += this.obstacles[y][x] ? "O " : "X ";
              }
            }
            console.log(rowStr.trim());
          }
        //TODO: send event to the eventual license plate reader of the presence of a new car.
        
    }

    //Update function.
    public update(deltaTime: number): void {

    }

    //Returns a JSON representation of the SmartCity.
    public toString(): string {
        const excludeFields = ['environment', 'initBase', 'thing', 'lastUpdateTime'];

        const cityJson = {
            title: this.getTitle(),
            type: this.constructor.name,
            ...Object.getOwnPropertyNames(this)
                .filter(field =>
                    typeof (this as any)[field] !== 'function' &&
                    !excludeFields.includes(field) &&
                    field !== 'rooms'
                )
                .reduce((obj: { [field: string]: any }, field) => {
                    obj[field] = (this as any)[field];
                    return obj;
                }, {})
        };

        const jsonString = JSON.stringify(cityJson, null, 2);

        return jsonString;
    }
}

//Factory function to create a new SmartCity istance
export function create(servient: Servient, init: WoT.ExposedThingInit): SmartCity {
    return new SmartCity(servient, init);
}