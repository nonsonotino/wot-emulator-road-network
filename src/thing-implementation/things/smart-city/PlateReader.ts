import Servient from "@node-wot/core";
import { SmartCity } from "../../environments/smart-city/SmartCity";
import { CityThing, PeriodicCityThing } from "./CityThing";
import { title } from "process";
import { get } from "http";

//Type representing the event emitted by the plate reader. 
export type ReaderEvent = {
    licencePlate: string,
    timestamp: Date,
};

//Class defining a plate reader inside the smart city simulation.
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
        events: {
            car_detected: {
                "description": "Event emitted when a car is detected by the plate reader.",
                "carId": {
                    "type": "string",
                    "description": "The car licence plate detected by the reader."
                },
                "timestamp": {
                    "type": "Date",
                    "description": "timestamp of the event."
                },
                "forms": [
                    {
                        "href": "car_detected",
                        "op": ["subscribeevent"],
                        "contentType": "application/json"
                    }
                ]
            }
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
        this.emitEvent("car_detected", {
            licencePlate: licencePlate,
            timestamp: new Date()
        });
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
            last_detected_event: this.getLastEvent() != null ? this.eventToString(this.getLastEvent() as ReaderEvent) : "No events detected",
        });
    }
}

//Factory function to create a new PlateReader instance.
export function create(servient: Servient, init: WoT.ExposedThingInit, environment: SmartCity): PlateReader {
    return new PlateReader(servient, init, environment);
}
