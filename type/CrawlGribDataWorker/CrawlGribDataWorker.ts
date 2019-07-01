'use strict';
import axios from "axios";
import * as fs from 'fs';
import * as path from 'path';
import {CrawlerUtils} from '../utils/CrawlerUtils';

class CrawlGribDataWorker {
    constructor(config) {
        this.targetURL = config.targetURL;
        this.localRepoPath = config.localGribDestination;
        if (!this.targetURL.includes("Authorization")) {
            throw new Error("Please check your open data json file URL, it should includes authorization token.");
        }
    }
    private targetURL: string;
    private localRepoPath: string;
    private targetHourString: string;
    // can load from config in futeure
    private tmpJSONFileName = `tmp_${this.targetHourString}.json`;
    private descrptJSONBaseURL: string = `https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/M-A0064-${this.targetHourString}?Authorization=CWB-6EEFC71A-2A8A-4F48-B579-930516FD5A33&downloadType=WEB&format=JSON`;
    private CWB_WRF_3KM_BASE_URL: string = `https://opendata.cwb.gov.tw/fileapi/opendata/MIC/M-A0064-${this.targetHourString}.grb2`;
    private CWB_WRF_3KM_GRB_FILE_NAME: string = `CWB_WRF_3KM_${this.targetHourString}.grb2`;
    private availableHours: number[] = [0, 6, 12, 18];
    private repoRoot: string = "D:\\CWB-GRB-WRF-3KM";
    private lagHour: number = 4;

    async getGRB(): Promise<any> {
        try {
            await CrawlerUtils.downloadFileToPath(this.descrptJSONBaseURL,path.join(this.repoRoot,this.tmpJSONFileName));
            fs.readFile
        }
        catch (error) {
            console.log(error)
        }
    }

    async downloadFileToPath(url: string, localPath: string) {
        try {
            let response = await axios.get(url, { responseType: "stream" });
            response.data.pipe(fs.createWriteStream(localPath));
        }
        catch (error) {
            console.log(error)
        }
    }

    /*
    * fetch lastes grib data from CWB open data
    */
    async fetch() {
        try {
            // check need to download or not
            // get latest grb local repositiry path and ensure it exist
            let nearestTimeDir = this.getNearestTimeDir();
            // check directory is exist
            if(!await CrawlerUtils.isPathExist(nearestTimeDir)){
                await CrawlerUtils.ensureDir(nearestTimeDir);
            }
            // check grb is exist
            let grbDir = path.join(nearestTimeDir,this.CWB_WRF_3KM_GRB_FILE_NAME);
            if(await CrawlerUtils.isPathExist(grbDir)){
                process.exit(0);
            }else{
                await CrawlerUtils.downloadFileToPath(this.descrptJSONBaseURL,path.join(this.repoRoot,this.tmpJSONFileName))
            }
            // get descript json
            let response = await axios.get(this.targetURL, { responseType: "stream" });
            response.data.pipe(fs.createWriteStream(this.localRepoPath + this.tmpJSONFileName));

        }
        catch (error) {
            console.log(error)
        }
    }


    private getNearestTimeDir(): string {
        // get UTC date
        let presentDate = new Date();
        presentDate.setHours(presentDate.getHours() - 8);
        console.log('now: ' + presentDate);
        // get latest hour of cwb open data grib file
        // lag hour of forcast publish time is needed
        let presentHour = presentDate.getHours();
        let latestGRBHour = presentHour - this.lagHour
        let largestPeriod: number = Infinity;
        let nearestHour: number = undefined;
        for (let hour of this.availableHours) {
            if (latestGRBHour - hour < largestPeriod && latestGRBHour - hour >= 0) {
                largestPeriod = latestGRBHour - hour;
                nearestHour = hour;
            } else if (latestGRBHour - hour < 0) {
                break;
            }
        }
        let year = presentDate.getFullYear().toString();
        let month = presentDate.getMonth().toString().padStart(2, "0");
        let hour = nearestHour.toString();
        // let nearestTimePath = this.repoRoot + "/" + presentDate.getFullYear().toString() + presentDate.getMonth().toString() + presentDate.getDay().toString() + nearestHour.toString() + "00";
        let nearestTimePath = path.join(this.repoRoot, presentDate.getFullYear().toString() + (presentDate.getMonth() + 1).toString().padStart(2, "0") + presentDate.getDay().toString().padStart(2, "0"), nearestHour.toString().padStart(2, "0"))
        return nearestTimePath;
    }
}

export { CrawlGribDataWorker }