import Servient from "@node-wot/core";
import { SmartCity } from "../../environments/smart-city/SmartCity";
import { SituatedThing } from "../../SituatedThing";

// Defines an abstract class that extends SituatedThing.
// This class represents any object inside the smart city.
export abstract class CityThing extends SituatedThing<SmartCity> {

    //Position inside the simulation grid
    protected x : number = 0;
    protected y : number = 0;

    //Boolean to define if the object is static or can
    //be moved inside the simulation grid.
    protected movable : boolean = false;
}