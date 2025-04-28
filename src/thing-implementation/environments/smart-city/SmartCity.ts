import Servient from "@node-wot/core";
import { Thing } from "../../Thing";
import { Tile } from "./Tile";

//The SmartCity class models an environment representing the road network of smart city.
//It aims to simulate the movement of a set of cars inside itself keeping track of their positions
//and the interactions they may have with other members of the simulation.
export class SmartCity extends Thing {

    //Smart city identifier.
    private title : string = "";

    //Simulation road network grid.
    private grid : Tile[][] = [];

    // Base structure of the city's TD.
    private static initBase: WoT.ExposedThingInit = {
        "@context": "https://www.w3.org/2019/wot/td/v1",
        "@type": "Environment",
        "description": "An environment representing a smart city's road network.",
        "forms": [
            {
                "href": "environment",
                "op": ["readproperty", "writeproperty", "observeproperty"],
                "contentType": "application/json"
            }
        ],
        "properties": {
            
        },
        "events": {

        }
    };

    //TODO: REWRITE METHOD
    constructor(servient: Servient, init: WoT.ExposedThingInit) {
        super(servient, init);
    }

    //Returns SmartCity identifier.
    public getTitle() : string {
        return this.title;
    }

    //Returns simulation grid.
    public getGrid() : Tile[][] {
        return this.grid;
    } 
    
    //Update function.
    public update(deltaTime: number): void {
        throw new Error("Method not implemented.");
    }
}