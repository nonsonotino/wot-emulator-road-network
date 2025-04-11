import Servient from "@node-wot/core";
import { SmartCity } from "../../environments/smart-city/SmartCity";
import { SituatedThing } from "../../SituatedThing";

// Define an abstract class that extends SituatedThing. This will serve as a base class for all things in the museum.
export abstract class MuseumThing extends SituatedThing<SmartCity> {

    // The ID of the room where the object is located
    protected roomId : string = '';
}