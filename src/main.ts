import { Servient } from "@node-wot/core";
import { HttpServer } from "@node-wot/binding-http";
import { Scheduler } from "./simulation/scheduler";
import { LampThing } from "./thing-model/things/LampThing";
import * as fs from 'fs';

const servient = new Servient();
servient.addServer(new HttpServer({ port: 8081 })); 

function createThingByType(type: string, eventTickRate: number, servient: Servient, init: WoT.ExposedThingInit) {
    switch (type) {
        case "LampThing":
            return new LampThing(servient, init, eventTickRate);
        default:
            throw new Error(`Unsupported Thing type: ${type}`);
    }
}

servient.start().then(async (WoT) => {
    const scheduler = new Scheduler(2000); 
    const thingsData = JSON.parse(fs.readFileSync('./src/td/things.json', 'utf8'));

    for (const thingConfig of thingsData) {
        try {
            const thingType = thingConfig.type;
            const eventTickRate = thingConfig.eventTickRate;
            const thing = createThingByType(thingType, eventTickRate, servient, thingConfig);
            await thing.getThing().expose(); 
            scheduler.addThing(thing); 
            console.log(`Thing of type ${thingType} exposed and added to scheduler.`);
        } catch (error) {
            console.error(`Failed to add thing: ${error}`);
        }
    }

    scheduler.start();
});
