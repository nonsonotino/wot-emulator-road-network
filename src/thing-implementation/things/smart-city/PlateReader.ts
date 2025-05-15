import Servient from "@node-wot/core";
import { SmartCity } from "../../environments/smart-city/SmartCity";
import { CityThing, PeriodicCityThing } from "./CityThing";
import { title } from "process";

//Type representing the event emitted by the plate reader. 
export type ReaderEvent  = {
    licencePlate: string,
    timestamp: Date,
};

export class PlateReader extends CityThing {

    //Plate reader history.
    private history: ReaderEvent[] = [];

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

        this.environment.addPlateReader(this);
    }

    //Return the history of the plate reader.
    public getHistory(): ReaderEvent[] {
        return this.history;
    }

    //Return formatted history of the plate reader.
    public getFormattedHistory(): string {
        return this.history.map(event => {
            return `Licence plate: ${event.licencePlate}, Timestamp: ${event.timestamp}`;
        }).join("\n");
    }

    //Return the last detected event.
    public getLastEvent(): ReaderEvent | null {
        if (this.history.length > 0) {
            return this.history[this.history.length - 1];
        }
        return null;
    }

    //Return the string representation of the event.
    public eventToString(event: ReaderEvent): string {
        return `Licence plate: ${event.licencePlate}, Timestamp: ${event.timestamp}`;
    }

    //TODO MAKE IT OBSERVABLE
    //Add a new event to the plate reader history.
    public addEvent(licencePlate: string): void {
        const event: ReaderEvent = {
            licencePlate: licencePlate,
            timestamp: new Date()
        };
        this.history.push(event);
    }

    //Plate reader update method.
    public update(deltaTime: number): void {

    }

    //Retutn the JSON representation of the car.
    public toString(): string {
        return JSON.stringify({
            title: this.getTitle(),
            type: this.constructor.name,
            id: this.getId(),
            coordinates: this.getCoordinates().x + " - " + this.getCoordinates().y,
            last_detected_event: this.eventToString(this.getLastEvent());
        });
    }
}

//Factory function to create a new PlateReader instance.
export function create(servient: Servient, init: WoT.ExposedThingInit, environment: SmartCity): PlateReader {
    return new PlateReader(servient, init, environment);
}
