import Servient from "@node-wot/core";
import { SmartCity } from "../../environments/smart-city/SmartCity";
import { CityThing, PeriodicCityThing } from "./CityThing";
import { title } from "process";


//Class that defines a traffic light inside the smart city simulation.
export class TrafficLight extends PeriodicCityThing {

    //State of the traffic light.
    private status: number = 0; // 0: red, 1: green

    //Base structure of the traffic light's TD.
    private static initBase: WoT.ExposedThingInit = {
        description: "A traffic light inside the simulation.",
        forms: [
            {
                href: "things",
                op: ["readproperty", "writeproperty", "observeproperty"],
                contentType: "application/json"
            }
        ],
        properties: {
            coords: {
                type: "object",
                description: "Coordinates of the traffic light in the grid.",
                observable: true,
                readOnly: true,
                writeOnly: false,
                forms: [
                    {
                        href: "coords",
                        op: ["readproperty"],
                        contentType: "application/json"
                    }
                ]
            }
        },
        actions: {
            //TODO toggle?
        }
    };

    //Return the status of the traffic light.
    public getStatus(): number {
        return this.status;
    }

    //Change the status of the traffic light.
    public toggle(): void {
        this.status = (this.status + 1) % 2; //0: red, 1: green.
    }
    
    //Traffic light constructor.
    constructor(servient: Servient, init: WoT.ExposedThingInit, environment: SmartCity, period: number) {
        super(servient, init, TrafficLight.initBase, environment, period);

        this.configureProperties(init);
        this.setPropertiesDefaultHandler(init);

        this.environment.addTrafficLight(this);
    }

    //Traffic light update function.
    public update(deltaTime: number): void {
        this.toggle();
    }

    //Retutn the JSON representation of the traffic light.
    public toString(): string {
        return JSON.stringify({
            title: this.getTitle(),
            type: this.constructor.name,
            id: this.getId(),
            coordinates: this.getCoordinates().x + " - " + this.getCoordinates().y,
            status: this.getStatus()
        })
    }
}

//Factory function to create a new TrafficLight instance.
export function create(servient: Servient, init: WoT.ExposedThingInit, environment: SmartCity, period: number): TrafficLight {
    return new TrafficLight(servient, init, environment, period);
}
