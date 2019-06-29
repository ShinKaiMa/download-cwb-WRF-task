'use strict';
import axios from "axios";
import * as fs from 'fs';


class CrawlGribDataWorker {
    constructor(config) {
        this.targetURL = config.targetURL;
        this.localGribDestination = config.localGribDestination;
        if(!this.targetURL.includes("Authorization")){
            throw new Error("Please check your open data json file URL, it should includes authorization token.");
        }
    }
    private tmpJSONFileName = "tmp.json";
    private targetURL: string;
    private localGribDestination: string;
    private targetHour: number;

    async getDescriptJSON(): Promise<any> {
        try {
            let response = await axios.get(this.targetURL, { responseType: "stream" });
            response.data.pipe(fs.createWriteStream(this.localGribDestination + this.tmpJSONFileName));
        }
        catch (error) {
            console.log(error)
        }
    }
}

export {CrawlGribDataWorker}