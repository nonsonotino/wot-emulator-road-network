import Servient from "@node-wot/core";
import { CityThing } from "./CityThing";
import { SituatedThing } from "../../SituatedThing";
import { write } from "fs";
import { SmartCity } from "../../environments/smart-city/SmartCity";
import { eventQueue } from "../../../simulation/eventQueue";
import { Coordinate } from "../../environments/smart-city/Coordinate";

//Class that defines a car inside the smart city simulation.
//It need to update its position moving in a new road cell.
export class Car extends CityThing {

    //Car identifier.
    private licensePlate: string = "";

    //Last visited cell.
    private lastVisitedCell: Coordinate = { x: 0, y: 0 };

    //Speed of the car(time to cross one cell).
    private speed: number = 0;

    //Base structure of the car's TD

    private static initBase: WoT.ExposedThingInit = {
        description: "A vehicle moving inside the road network.",
        forms: [ 
            {
                href: "things",
                op: ["readproperty", "writeproperty", "observeproperty"],
                contentType: "application/json"
            }
        ],
        properties: {
            licensePlate: {
                type: "string",
                description: "Unique alphanumeric identification of a vehicle in the simulation.",
                observable: true,
                readOnly: true,
                witeOnly: false,
                forms: [
                    {
                        href: "licensePlate",
                        op: ["readproperty"],
                        contentType: "application/json"
                    }
                ]
            },
            coords: {
                type: "object",
                description: "Coordinates of the car in the grid.",
                observable: true,
                readOnly: false,
                writeOnly: false,
                forms: [
                    {
                        href: "coords",
                        op: ["readproperty"],
                        contentType: "application/json"
                    }
                ]
            },
            speed: {
                type: "number",
                description: "Time to cross one cell.",
                observable: true,
                readOnly: true,
                writeOnly: false,
                forms: [
                    {
                        href: "speed",
                        op: ["readproperty"],
                        contentType: "application/json"
                    }
                ]
            },
        },
        actions: {
        }
    };

    //Car constructor.
    constructor(servient: Servient, init: WoT.ExposedThingInit, environment: SmartCity) {
        super(servient, init, Car.initBase, environment);

        this.setReadHandler("licensePlate");
        this.setReadHandler("speed");
        this.setReadHandler("coords");
        this.setWriteHandler("coords");

        this.configureProperties(init);
    }

    //Returns the car's liecense plate.
    public getLicensePlate(): string {
        return this.licensePlate;
    }

    //Return the car's coordinates.
    public getCoordinates(): Coordinate {
        return this.coords; 
    }   

    //Returns the last visited cell.
    public getLastVisitedCell(): Coordinate {
        return this.lastVisitedCell;
    }

    //Move the car in the specified cell.
    public moveTo(newCoords: Coordinate): void {
        this.lastVisitedCell = this.coords;
        this.coords = newCoords;
    }

    //The car moves in a random direction from those available
    //updates its own position and the position in the environment.
    public update(deltaTime: number): void {

        if(deltaTime > this.speed) { //TODO: Rewrite this condition.
            eventQueue.enqueueEvent(() => this.environment.moveCar(this.licensePlate));
        }
    }
}

// Factory function to create a new Car instance.
export function create(servient: Servient, init: any, environment: SmartCity, coords: Coordinate, speed: number): Car {
    return new Car(servient, init, environment);
}
