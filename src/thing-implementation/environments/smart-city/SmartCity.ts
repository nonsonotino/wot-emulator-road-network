import Servient from "@node-wot/core";
import { Thing } from "../../Thing";
import { Tile } from "./Tile";

//The SmartCity class models an environment representing the road network of smart city.
//It aims to simulate the movement of a set of cars inside itself keeping track of their positions
//and the interactions they may have with other members of the simulation.
export class SmartCity extends Thing {

    //Smart city identifier.
    private title: string = "";

    //Simulation road network grid.
    private grid: Tile[][] = [];

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

    //TODO: FINISH METHOD
    //Smart city constructor.
    constructor(servient: Servient, init: WoT.ExposedThingInit) {
        const tmpGrid: Tile[][] = [];

        (init.tiles as any).forEach((tileInit: any) => {
            tmpGrid[tileInit.x][tileInit.y] = new Tile(tileInit.title, tileInit.x, tileInit.y, tileInit.isObstacle,
                tileInit.vehicles, tileInit.staticObjects);

            const tileId = tileInit.title;

            //TODO add properties
        });

        super(servient, init, SmartCity.initBase);

        this.configureProperties(init);
        this.setPropertiesDefaultHandler(init);

        this.grid = tmpGrid;

        //TODO urls
    }

    //Returns SmartCity identifier.
    public getTitle(): string {
        return this.title;
    }

    //Returns simulation grid.
    public getGrid(): Tile[][] {
        return this.grid;
    }

    //Update function.
    public update(deltaTime: number): void {
        throw new Error("Method not implemented.");
    }

    //TODO: implement
    //Returns a JSON representation of the SmartCity.
    public toString(): string {
        return "";
    }
}

//TODO: is it necessary?
//Factory function to create a new SmartCity istance
export function create(servient: Servient, init: WoT.ExposedThingInit): SmartCity {
    return new SmartCity(servient, init);
}