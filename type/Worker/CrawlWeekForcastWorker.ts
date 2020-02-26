import { cwbGribCrawlerConfig } from '../config/config.env'
import { Worker } from './Worker'
import { OneWeeakForcast } from "../models/OneWeekForcast.model"
import axios from "axios";

class CrawlWeekForcastWorker extends Worker {
    constructor() {
        super();
    }
    private authToken = cwbGribCrawlerConfig.authToken;
    private baseURL = "https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/F-D0047-091"

    public async work() {
        try {
            let response = await axios.get(this.baseURL,
                {
                    params:
                    {
                        Authorization: cwbGribCrawlerConfig.authToken,
                        // downloadType: "WEB",
                        format: "JSON"
                    }
                })
            let forcastData = response.data.cwbopendata
            console.log(forcastData)
            console.log("ARRAY:")
            console.log("========")
            console.log(forcastData.dataset.locations.location)
            let record = new OneWeeakForcast({
                dataid: forcastData.dataid,
                sent: new Date(forcastData.sent),
                locations: forcastData.dataset.locations.location
            });
            await record.save();
        } catch (error) {
            console.log(error)
        }
    }

    public async simuAsync() {
        return new Promise((resolve, reject) => {
            let second = 2;
            // let second = Math.floor(Math.random()*5)+1;
            // let second = 1;
            second *= 1000;
            setTimeout(function () {
                // console.log(self.targetHourString + " work! in " + second)
                resolve();
            }, second);
        })
    }

    public toString(): string {
        return `CrawlWeekForcastWorker - authToken: ${this.authToken.substring(0, 5)}****`;
    }
}

export default CrawlWeekForcastWorker;