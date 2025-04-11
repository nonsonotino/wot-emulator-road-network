import Servient from "@node-wot/core";
import { Thing } from "../../Thing";

//The SmartCity class models an environment representing the road network of smart city.
//It aims to simulate the movement of a set of cars inside itself keeping track of their positions
//and the interactions they may have with other members of the simulation.
export class SmartCity extends Thing {

    
    public update(deltaTime: number): void {
        throw new Error("Method not implemented.");
    }
    
}