import Servient from "@node-wot/core";
import { SmartCity } from "../../environments/smart-city/SmartCity";
import { CityThing, PeriodicCityThing } from "./CityThing";

export class PlateReader extends CityThing {

    //Base structure of the plate reader's TD.
    private static initBase: WoT.ExposedThingInit = {
        description: "A plate reader inside the simulation.",
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
                description: "Coordinates of the plate reader in the grid.",
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
        }
    };

    //Plate reader constructor.
    constructor(servient: Servient, init: WoT.ExposedThingInit, environment: SmartCity) {
        super(servient, init, PlateReader.initBase, environment);

        this.configureProperties(init);
        this.setPropertiesDefaultHandler(init);

        //TODO add to environment
        this.environment.addPlateReader(this);
    }

    //Plate reader update method.
    public update(deltaTime: number): void {

    }
}

//Factory function to create a new PlateReader instance.
export function create(servient: Servient, init: WoT.ExposedThingInit, environment: SmartCity): PlateReader {
    return new PlateReader(servient, init, environment);
}
