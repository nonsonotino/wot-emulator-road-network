import Servient from "@node-wot/core";
import { CityThing } from "./CityThing";
import { SituatedThing } from "../../SituatedThing";
import { write } from "fs";
import { SmartCity } from "../../environments/smart-city/SmartCity";
import { eventQueue } from "../../../simulation/eventQueue";

//Class that defines a car inside the smart city simulation.
//It need to update its position moving in a new road cell.
class Car extends CityThing {

    private licensePlate: string = "";

    //Base structure of the car's TD
    private static initBase: WoT.ExposedThingInit = {
        description: "Representation of a vehicle moving inside the road network.",
        forms: [ //TODO check correttezza form
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
    constructor(servient: Servient, init: WoT.ExposedThingInit, environment: SmartCity) {
        super(servient, init, Car.initBase, environment);

        //TODO setup action handlers

        this.setPropertiesDefaultHandler(init);
        this.configureProperties(init);
    }

    //Returns the car's liecense plate.
    public getLicensePlate(): string {
        return this.licensePlate;
    }

    //The car moves in a random direction from those available
    //updates its own position and the position in the environment.
    public update(deltaTime: number): void {
        //TODO: create a SmartCity method to get the next tile in the path.
    }
}

// Factory function to create a new Car instance.
export function create(servient: Servient,
                       init: any,
                       environment: SmartCity): Car {
    return new Car(servient, init, environment);
}
