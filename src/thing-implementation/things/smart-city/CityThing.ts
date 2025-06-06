import Servient from "@node-wot/core";
import { SmartCity } from "../../environments/smart-city/SmartCity";
import { SituatedThing } from "../../SituatedThing";
import { Coordinate } from "../../environments/smart-city/Coordinate";
import { PeriodicThing } from "../../PeriodicThing";

//Defines an abstract class that extends SituatedThing.
//This class represents any non time-dependent object inside the smart city.
export abstract class CityThing extends SituatedThing<SmartCity> {

    //Position inside the simulation grid
    protected coords: Coordinate = { x: 0, y: 0 };

    //Return the coordinates of the object in the grid.
    public getCoordinates(): Coordinate {
        return this.coords;
    }
}

//Defines an abstract class that extends PeriodicThing.
//This class represents any object inside the smart city that has a periodic behavior.
export abstract class PeriodicCityThing extends PeriodicThing<SmartCity> {

    //Position inside the simulation grid
    protected coords: Coordinate = { x: 0, y: 0 };

    //Return the coordinates of the object in the grid.
    public getCoordinates(): Coordinate {
        return this.coords;
    }
} 