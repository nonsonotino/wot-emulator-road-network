import Servient from "@node-wot/core";
import { SmartCity } from "../../environments/smart-city/SmartCity";
import { SituatedThing } from "../../SituatedThing";
import { Coordinate } from "../../environments/smart-city/Coordinate";
import { PeriodicThing } from "../../PeriodicThing";

// Defines an abstract class that extends SituatedThing.
// This class represents any object inside the smart city.
export abstract class CityThing extends SituatedThing<SmartCity> {

    //Position inside the simulation grid
    protected coords: Coordinate = { x: 0, y: 0 };  
    
}

export abstract class PeriodicCityThing extends PeriodicThing<SmartCity> {
    
    //Object identifier.
    protected objectID: string = "";

    //Position inside the simulation grid
    protected coords: Coordinate = { x: 0, y: 0 };

    //Return the object id.
    public getObjectId(): string {
        return this.objectID;
    }

    //Return the coordinates of the object in the grid.
    public getCoordinates(): Coordinate {
        return this.coords;
    }

} 