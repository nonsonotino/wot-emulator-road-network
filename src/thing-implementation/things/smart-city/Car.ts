import Servient from "@node-wot/core";
import { CityThing, PeriodicCityThing } from "./CityThing";
import { SituatedThing } from "../../SituatedThing";
import { write } from "fs";
import { SmartCity } from "../../environments/smart-city/SmartCity";
import { eventQueue } from "../../../simulation/eventQueue";
import { Coordinate } from "../../environments/smart-city/Coordinate";
import { title } from "process";

//Class that defines a car inside the smart city simulation.
//It need to update its position moving in a new road cell.
export class Car extends PeriodicCityThing {

    //Last visited cell.
    private lastVisitedCell: Coordinate = { x: 0, y: 0 };

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
            period: {
                type: "number",
                description: "Time to cross one cell.",
                observable: true,
                readOnly: true,
                writeOnly: false,
                forms: [
                    {
                        href: "period",
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
    constructor(servient: Servient, init: WoT.ExposedThingInit, environment: SmartCity, period: number) {
        super(servient, init, Car.initBase, environment, period);

        this.configureProperties(init);
        this.setPropertiesDefaultHandler(init);

        this.environment.addCar(this);
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

    //The car moves in a random direction from those available and
    //updates its own position and the position in the environment.
    public update(deltaTime: number): void {
        eventQueue.enqueueEvent(() => this.environment.moveCar(this));
    }

    //Retutn the JSON representation of the car.
    public toString(): string {
        return JSON.stringify({
            title: this.getTitle(),
            type: this.constructor.name,
            licensePlate: this.getId(),
            coordinates: this.getCoordinates().x + " - " + this.getCoordinates().y,
            speed: this.period
        });
    }
}

//Factory function to create a new Car instance.
export function create(servient: Servient, init: any, environment: SmartCity, period: number): Car {
    return new Car(servient, init, environment, period);
}
