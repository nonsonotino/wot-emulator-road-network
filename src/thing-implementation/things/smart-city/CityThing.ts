import Servient from "@node-wot/core";
import { SmartCity } from "../../environments/smart-city/SmartCity";
import { SituatedThing } from "../../SituatedThing";

// Defines an abstract class that extends SituatedThing.
// This class represents any object inside the smart city.
export abstract class CityThing extends SituatedThing<SmartCity> {

    //Position inside the simulation grid
    protected coords: Coordinate = { x: 0, y: 0 };  

    //Boolean to define if the object is static or can
    //be moved inside the simulation grid.
    protected movable: boolean = true; //TODO: is it needed?
}