import Servient from "@node-wot/core";
import { CityThing } from "./CityThing";
import { SituatedThing } from "../../SituatedThing";
import { write } from "fs";
import { SmartCity } from "../../environments/smart-city/SmartCity";
import { eventQueue } from "../../../simulation/eventQueue";

//Class that defines a car inside the smart city simulation.
//It need to update its position moving in a new road cell.
class Car extends CityThing {

    //Car identifier.
    private licensePlate: string = "";

    //Last visited cell.
    private lastVisitedCell: Coordinate = { x: 0, y: 0 };

    //Speed of the car.
    private speed: number = 0;//TODO implemet

    //Base structure of the car's TD
    //TODO Rewrite
    private static initBase: WoT.ExposedThingInit = {
        description: "Representation of a vehicle moving inside the road network.",
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
            }
        },
        actions: {
            move: {//TODO: non mi serve, tengo solo per riferimento
                description: "Moves the car in the next cell in its path.",
                forms: [
                    {
                        href: "move",
                        op: ["invokeaction"]
                    }
                ]
            }
        }
    };

    //Car constructor.
    constructor(servient: Servient, init: WoT.ExposedThingInit, environment: SmartCity, coords: Coordinate) {
        super(servient, init, Car.initBase, environment);

        //Set starting point
        this.coords = coords;

        this.setPropertiesDefaultHandler(init);
        this.configureProperties(init);
    }

    //Returns the car's liecense plate.
    public getLicensePlate(): string {
        return this.licensePlate;
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
        //TODO: create a SmartCity method to get the next tile in the path.
    }
}

// Factory function to create a new Car instance.
export function create(servient: Servient, init: any, environment: SmartCity, coords: Coordinate): Car {
    return new Car(servient, init, environment, coords);
}
