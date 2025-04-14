import Servient from "@node-wot/core";
import { CityThing } from "./CityThing";
import { SituatedThing } from "../../SituatedThing";
import { write } from "fs";

//Class that defines a car inside the smart city simulation.
//It need to update its position moving in a new road cell.
class Car extends CityThing {

    private licensePlate : string = "";

        // Base structure of the car's TD
        private static initBase : WoT.ExposedThingInit = {
            description: "Representation of a veichle moving inside the road network.",
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
                    description: "Unique alphanumeric identification of a veichle in the simulation.",
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
    
    //The car moves in a random direction from those available
    //updates its own position and the position in the envoronment.
    public update(deltaTime: number): void {
        throw new Error("Method not implemented.");
    }
}
