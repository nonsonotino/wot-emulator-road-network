import Servient from "@node-wot/core";
import { Thing } from "../../Thing";
import { Car } from "../../things/smart-city/Car"; // Import the Car type
import { Coordinate, areCoordinatesEqual } from "./Coordinate";
import { TrafficLight } from "../../things/smart-city/TrafficLight";
import { PlateReader } from "../../things/smart-city/PlateReader";
import { title } from "process";
import { get } from "http";

//The SmartCity class models an environment representing the road network of smart city.
//It aims to simulate the movement of a set of cars inside itself keeping track of their positions
//and the interactions they may have with other members of the simulation.
export class SmartCity extends Thing {

    //Smart city identifier.
    private title: string = "";

    //Dimensions of the simulation grid.
    private gridHeight: number = 0;
    private gridWidth: number = 0;

    //Obstacles positions.
    private obstacles: boolean[][] = [];

    //List of traffic lights positions.
    private trafficLights: Map<string, TrafficLight> = new Map<string, TrafficLight>();

    //list of plate readers positions.
    private plateReaders: Map<string, PlateReader> = new Map<string, PlateReader>();

    //List of cars positions.
    private cars: Map<string, Car> = new Map<string, Car>();

    //List of the direcrions in which a car can move.
    static directions = [
        { x: 0, y: -1 }, //Up
        { x: 1, y: 0 }, //Right
        { x: 0, y: 1 }, //Down
        { x: -1, y: 0 } //Left
    ];

    //Base structure of the city's TD.
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

    //Smart city constructor.
    constructor(servient: Servient, init: WoT.ExposedThingInit) {
        super(servient, init, SmartCity.initBase);

        this.configureProperties(init);
        this.setPropertiesDefaultHandler(init);

        this.gridHeight = this.obstacles.length;
        this.gridWidth = this.obstacles[0].length;

        //TODO properties urls
    }

    //Returns SmartCity identifier.
    public getTitle(): string {
        return this.title;
    }

    //Add traffic light to the simulation grid.
    public addTrafficLight(trafficLight: TrafficLight): void {
        const id = trafficLight.getId();
        if (!this.trafficLights.has(id)) {
            this.trafficLights.set(id, trafficLight);
        }
    }

    //Add plate reader to the simulation grid.
    public addPlateReader(plateReader: PlateReader): void {
        const id = plateReader.getId();
        if (!this.plateReaders.has(id)) {
            this.plateReaders.set(id, plateReader);
        }
    }

    //Add car to the simulation grid.
    public addCar(car: Car): void {
        console.log("Adding car to the simulation grid" + car.getId());
        if (!this.cars.has(car.getId())) {
            this.cars.set(car.getId(), car);
        }
    }

    //Search Traffic light by coordinates.
    private getTrafficLight(coords: Coordinate): TrafficLight | undefined {

        for (let tl of this.trafficLights.values()) {
            if (areCoordinatesEqual(tl.getCoordinates(), coords)) {
                return tl;
            }
        }

        return undefined;
    }

    //Search Plate reader by coordinates.
    private getPlateReader(coords: Coordinate): PlateReader | undefined {

        for (let pr of this.plateReaders.values()) {
            if (areCoordinatesEqual(pr.getCoordinates(), coords)) {
                return pr;
            }
        }

        return undefined;
    }

    //Rerturn cars by position inside the simulation.
    private getCarsByCoordinates(coords: Coordinate): Car[] {
        const cars: Car[] = [];

        for (let car of this.cars.values()) {
            if (areCoordinatesEqual(car.getCoordinates(), coords)) {
                cars.push(car);
            }
        }

        return cars;
    }

    //Returns a random valid neighbor of the specified coordinates.
    private getValidNeighbor(coords: Coordinate, prevCell: Coordinate): Coordinate {

        //Filter valid neighbors based on grid boundaries and obstacles.
        const validNeighbors: Coordinate[] = [];

        for (const direction of SmartCity.directions) {
            const newX = coords.x + direction.x;
            const newY = coords.y + direction.y;

            if (newX >= 0 && newX < this.gridWidth && newY >= 0 && newY < this.gridHeight && this.obstacles[newY][newX] && (newX !== prevCell.x || newY !== prevCell.y)) {
                validNeighbors.push({ x: newX, y: newY });
            }
        }

        return validNeighbors[Math.floor(Math.random() * validNeighbors.length)];
    }

    //Move the specified car in an avilable tile of the grid.
    public async moveCar(car: Car): Promise<void> {

        const newPosition = this.getValidNeighbor(car.getCoordinates(), car.getLastVisitedCell());
        const trafficLight = this.getTrafficLight(newPosition);
        const plateReader = this.getPlateReader(newPosition);

        if (trafficLight?.getStatus() == 0) {
            return; //The car cannot move to a red light
        } else {
            car.moveTo(newPosition);
        }

        //TODO: send event to the eventual license plate reader of the presence of a new car.
        if(plateReader != undefined) {
            plateReader.addEvent(car.getId());
        }
    }

    //Print the simulation
    private getGrid(): string {
        let grid = "";

        for (let y = 0; y < this.gridHeight; y++) {
            let rowStr = "";
            for (let x = 0; x < this.gridWidth; x++) {
                const coords = { x, y };
                const cars = this.getCarsByCoordinates(coords);

                if (cars.length > 0) {
                    rowStr += cars.length + " ";
                }
                else if (this.getTrafficLight(coords) != undefined) {
                    rowStr += "+ ";
                } else {
                    rowStr += this.obstacles[y][x] ? "O " : "X ";
                }
            }
            grid += rowStr.trim() + "\n";
        }

        return grid;
    }

    //Update function.
    public update(deltaTime: number): void {
        console.clear();
        console.log(this.getGrid());
    }

    //Returns a JSON representation of the SmartCity.
    public toString(): string {
        return JSON.stringify({
            title: this.getTitle(),
            type: this.constructor.name,
            cars_number: this.cars.size,
            trafficlight_number: this.trafficLights.size,
            platereader_number: this.plateReaders.size,
            grid: "\n" + this.getGrid()
        });
    }
}

//Factory function to create a new SmartCity istance
export function create(servient: Servient, init: WoT.ExposedThingInit): SmartCity {
    return new SmartCity(servient, init);
}