'use strict';
import axios from "axios";
import * as fs from 'fs';
import * as path from 'path';
import { CrawlerUtil } from '../utils/CrawlerUtil';

class CrawlGribDataWorker {
    constructor(config) {
        this.targetHourString = config.targetHourString;
        this.localRootRepoDir = config.localRootRepoDir;
        if (!this.targetHourString || !this.localRootRepoDir) {
            throw new Error("Param: targetHourString or localRepoPath is needed.");
        }
    }
    private localRootRepoDir: string;
    private targetHourString: string;
    // can load from config in future
    public tmpJSONFileName = `tmp_${this.targetHourString}.json`;
    private descrptJSONBaseURL: string = `https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/M-A0064-${this.targetHourString}?Authorization=CWB-6EEFC71A-2A8A-4F48-B579-930516FD5A33&downloadType=WEB&format=JSON`;
    private CWB_WRF_3KM_GRB_URL: string = `https://opendata.cwb.gov.tw/fileapi/opendata/MIC/M-A0064-${this.targetHourString}.grb2`;
    private CWB_WRF_3KM_GRB_FILE_NAME: string = `CWB_WRF_3KM_${this.targetHourString}.grb2`;
    private availableHours: number[] = [0, 6, 12, 18];
    private lagHour: number = 4;

    public init(){
        this.tmpJSONFileName = `tmp_${this.targetHourString}.json`;
        this.descrptJSONBaseURL =`https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/M-A0064-${this.targetHourString}?Authorization=CWB-6EEFC71A-2A8A-4F48-B579-930516FD5A33&downloadType=WEB&format=JSON`;
        this.CWB_WRF_3KM_GRB_URL = `https://opendata.cwb.gov.tw/fileapi/opendata/MIC/M-A0064-${this.targetHourString}.grb2`;
        this.CWB_WRF_3KM_GRB_FILE_NAME = `CWB_WRF_3KM_${this.targetHourString}.grb2`;

    }

    /*
    * fetch lastes grib data from CWB open data
    */
    public async fetchGRB(): Promise<void> {
        let nearestTimeDir = this.getNearestTimeDir();
        let localGRBDir = path.join(nearestTimeDir, this.CWB_WRF_3KM_GRB_FILE_NAME);
        let tmpJSONDir = path.join(nearestTimeDir, this.tmpJSONFileName);
        try {
            // check need to download or not
            // get latest grb local repositiry path
            if (!await CrawlerUtil.isPathExist(nearestTimeDir)) await CrawlerUtil.ensureDir(nearestTimeDir);
            // check grb is exist
            if (await CrawlerUtil.isPathExist(localGRBDir)) {
                process.exit(0);
            }
            // get grib data descript json

            console.log(`Downloading ${this.descrptJSONBaseURL} to ${tmpJSONDir}`)
            await CrawlerUtil.downloadFileToPath(this.descrptJSONBaseURL, tmpJSONDir)

            let descriptJSON = await CrawlerUtil.loadJSON(tmpJSONDir);
            let runTime: string = descriptJSON.cwbopendata.dataset.datasetInfo.parameterSet[3].parameterValue
            if (!runTime) throw new Error("Can not get run time from open data descript json.");
            // compare remote file generate time
            let localGRBTimePathSeg:string[] = nearestTimeDir.split(path.sep);
            let remoteRunTimeSeg:string[] = runTime.replace("Z","").split(" ");
            console.log("localGRBTimePathSeg: " + localGRBTimePathSeg);
            console.log("remoteRunTimeSeg: " + remoteRunTimeSeg);

            // download grib
            if(Number(localGRBTimePathSeg[2]) >= Number(remoteRunTimeSeg[0]) && Number(localGRBTimePathSeg[3]) >= Number(remoteRunTimeSeg[1])){
                console.log(`Downloading ${this.CWB_WRF_3KM_GRB_URL} to ${localGRBDir}`)
                await CrawlerUtil.downloadFileToPath(this.CWB_WRF_3KM_GRB_URL,localGRBDir);
            }
            // case of local repository do not have older file
            else if(!CrawlerUtil.isPathExist(path.join(this.localRootRepoDir,remoteRunTimeSeg[0],remoteRunTimeSeg[1]))){
                let olderGRBDir = path.join(this.localRootRepoDir,remoteRunTimeSeg[0],remoteRunTimeSeg[1],this.CWB_WRF_3KM_GRB_FILE_NAME);
                console.log(`Downloading ${this.CWB_WRF_3KM_GRB_URL} to ${olderGRBDir}`)
                await CrawlerUtil.downloadFileToPath(this.CWB_WRF_3KM_GRB_URL,olderGRBDir);
            }
        }
        catch (error) {
            console.log(error)
            if(await CrawlerUtil.isPathExist(tmpJSONDir)){
                console.log('del1')
                await CrawlerUtil.remove(tmpJSONDir)
            }
            if(await CrawlerUtil.isPathExist(localGRBDir)){
                console.log('del2')
                await CrawlerUtil.remove(localGRBDir)
            }
        }
    }

    /**
     * @return Estimate latest available grib directory by current time. Example:${repoRoot}/20190702/00
     */
    public getNearestTimeDir(): string {
        // get UTC date
        let presentDate = new Date();
        presentDate.setHours(presentDate.getHours() - 8);
        // get latest hour of cwb open data grib file
        // lag hour of forcast publish time is needed
        let presentHour = presentDate.getHours();
        // estimate "lastest" probably available grb hour by shift {lagHour}
        // {lagHour}(unit: hour) means the period between forcast start time and forcast publish time
        let latestGRBHour = presentHour - this.lagHour
        // if latestGRBHour < 0, standardize it to yesterday hour (i.e : -2 o'clock -> 22 o'clock (yesterday))
        if (latestGRBHour < 0) {
            latestGRBHour = 24 + latestGRBHour;
        }
        // start to calculate nearest availble forcast hour
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
        let month = (presentDate.getMonth() + 1).toString().padStart(2, "0");
        let day = presentDate.getDay().toString().padStart(2, "0")
        let hour = nearestHour.toString().padStart(2, "0")
        let nearestTimePath = path.join(this.localRootRepoDir, year + month + day, hour);
        return nearestTimePath;
    }
}

export { CrawlGribDataWorker }