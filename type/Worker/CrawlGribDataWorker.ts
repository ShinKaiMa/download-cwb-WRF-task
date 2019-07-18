'use strict';
import axios from "axios";
import * as fs from 'fs';
import * as path from 'path';
import { CrawlerUtil } from '../utils/CrawlerUtil';
import { logger } from '../logger/logger';
import {DataStatus} from '../models/DataStatus.model';


interface CrawlGribDataWorkerConfig {
    targetHourString: string,
    localGRBRootRepoDir: string,
    authToken: string
}

class CrawlGribDataWorker {
    constructor(config: CrawlGribDataWorkerConfig) {
        this.targetHourString = config.targetHourString;
        this.localGRBRootRepoDir = config.localGRBRootRepoDir;
        this.authToken = config.authToken;
    }
    private localGRBRootRepoDir: string;
    private targetHourString: string;
    private authToken: string;
    // can load from config in future
    private tmpJSONFileName = `tmp_${this.targetHourString}.json`;
    private descrptJSONBaseURL: string
    private CWB_WRF_3KM_GRB_URL: string
    private CWB_WRF_3KM_GRB_FILE_NAME: string
    private availableHours: number[] = [0, 6, 12, 18];
    private lagHour: number = 4;

    private init() {
        this.tmpJSONFileName = `tmp_${this.targetHourString}.json`;
        this.descrptJSONBaseURL = `https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/M-A0064-${this.targetHourString}?Authorization=${this.authToken}&downloadType=WEB&format=JSON`;
        this.CWB_WRF_3KM_GRB_URL = `https://opendata.cwb.gov.tw/fileapi/opendata/MIC/M-A0064-${this.targetHourString}.grb2?Authorization=${this.authToken}`;
        this.CWB_WRF_3KM_GRB_FILE_NAME = `CWB_WRF_3KM_${this.targetHourString}.grb2`;
    }


    /**
     * fetch lastes grib data from CWB open data, return fetched local file path.
     */
    public async fetchGRB(): Promise<string> {
        this.init();
        let nearestTimeDir = this.getNearestTimeDir();
        let localGRBDir = path.join(nearestTimeDir, this.CWB_WRF_3KM_GRB_FILE_NAME);
        let tmpJSONDir = path.join(nearestTimeDir, this.tmpJSONFileName);
        logger.debug(`Trying to fetch GRB: ${this.CWB_WRF_3KM_GRB_URL.replace(this.authToken, "****")}`);
        logger.debug("nearestTimeDir: " + nearestTimeDir);
        logger.debug("localGRBDir: " + localGRBDir);
        logger.debug("tmpJSONDir: " + tmpJSONDir);
        try {
            // check need to download or not
            // get latest grb local repositiry path
            if (!await CrawlerUtil.isPathExist(nearestTimeDir)) await CrawlerUtil.ensureDir(nearestTimeDir);
            // check grb is exist
            if (await CrawlerUtil.isPathExist(localGRBDir)) {
                logger.info(localGRBDir + " already exist. skip.")
                return localGRBDir;
            }
            // get grib data descript json

            logger.info(`Downloading ${this.descrptJSONBaseURL.replace(this.authToken, "*****")} to ${tmpJSONDir}`);
            await CrawlerUtil.downloadFileToPath(this.descrptJSONBaseURL, tmpJSONDir)

            let descriptJSON = await CrawlerUtil.loadJSON(tmpJSONDir);
            let runTime: string = descriptJSON.cwbopendata.dataset.datasetInfo.parameterSet[3].parameterValue
            logger.debug(`get run time from descript JSON file:  ${runTime}`);
            if (!runTime) throw new Error("Can not get run time from open data descript json.");
            // compare remote file generate time
            let localGRBTimePathSeg: string[] = nearestTimeDir.split(path.sep);
            localGRBTimePathSeg.shift();
            let remoteRunTimeSeg: string[] = runTime.replace("Z", "").split(" ");
            logger.debug(`localGRBTimePathSeg: ${localGRBTimePathSeg}`);
            logger.debug(`remoteRunTimeSeg: ${remoteRunTimeSeg}`);
            // download grib
            // at time matched situation
            if (Number(localGRBTimePathSeg[localGRBTimePathSeg.length - 2]) === Number(remoteRunTimeSeg[0]) && Number(localGRBTimePathSeg[localGRBTimePathSeg.length - 1]) === Number(remoteRunTimeSeg[1])) {
                logger.info(`Downloading ${this.CWB_WRF_3KM_GRB_URL.replace(this.authToken, "*****")} to ${localGRBDir}`);
                await CrawlerUtil.downloadFileToPath(this.CWB_WRF_3KM_GRB_URL, localGRBDir);
                logger.info(`Download ${localGRBDir} successfully`);
                let dataStatus = new DataStatus({
                    dataType:"GRB",
                    area:"EA",
                    contentType:"CWB-WRF-3KM",
                    path:localGRBDir,
                    status:"saved",
                    byte:await CrawlerUtil.getFileSize(localGRBDir)
                });
                await dataStatus.save();
                logger.debug(`save ${JSON.stringify(dataStatus)} success.`)
                return localGRBDir;
            }
            // case of local repository do not have older file && time not matched situation (use remote run time)
            else {
                let olderGRBDir = path.join(this.localGRBRootRepoDir, remoteRunTimeSeg[0], remoteRunTimeSeg[1], this.CWB_WRF_3KM_GRB_FILE_NAME);
                if (await CrawlerUtil.isPathExist(path.join(this.localGRBRootRepoDir, remoteRunTimeSeg[0], remoteRunTimeSeg[1]))) {
                    logger.info(`Older GRB Dir root: ${path.join(this.localGRBRootRepoDir, remoteRunTimeSeg[0], remoteRunTimeSeg[1])} already exist.`)
                    if (await CrawlerUtil.isPathExist(olderGRBDir)) {
                        logger.info(`Older GRB file: ${olderGRBDir} already exist. skip download.`)
                        return olderGRBDir;
                    }
                }
                CrawlerUtil.ensureDir(path.join(this.localGRBRootRepoDir, remoteRunTimeSeg[0], remoteRunTimeSeg[1]));
                logger.info(`Downloading ${this.CWB_WRF_3KM_GRB_URL.replace(this.authToken, "*****")} to ${olderGRBDir}`);
                await CrawlerUtil.downloadFileToPath(this.CWB_WRF_3KM_GRB_URL, olderGRBDir);
                logger.info(`Download ${olderGRBDir} successfully`);
                let dataStatus = new DataStatus({
                    dataType:"GRB",
                    area:"EA",
                    contentType:"CWB-WRF-3KM",
                    path:olderGRBDir,
                    status:"saved",
                    byte:await CrawlerUtil.getFileSize(olderGRBDir)
                });
                await dataStatus.save();
                logger.debug(`save ${JSON.stringify(dataStatus)} success.`)
                return olderGRBDir;
            }
        }
        catch (error) {
            logger.error(`Error: ${error}`);
            if (await CrawlerUtil.isPathExist(tmpJSONDir)) {
                await CrawlerUtil.remove(tmpJSONDir);
                logger.error(`Exception encountered, delete ${tmpJSONDir}`);
            }
            if (await CrawlerUtil.isPathExist(localGRBDir)) {
                await CrawlerUtil.remove(localGRBDir);
                logger.error(`Exception encountered, delete ${localGRBDir}`);
            }
        }
        finally {
            if (await CrawlerUtil.isPathExist(tmpJSONDir)) {
                await CrawlerUtil.remove(tmpJSONDir);
                logger.info(`Delete ${tmpJSONDir}`);
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
            presentDate.setDate(presentDate.getDate() - 1);
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
        let day = presentDate.getDate().toString().padStart(2, "0")
        let hour = nearestHour.toString().padStart(2, "0")
        let nearestTimePath = path.join(this.localGRBRootRepoDir, year + month + day, hour);
        return nearestTimePath;
    }

    public async simuAsync() {
        let self: CrawlGribDataWorker = this;
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
}

export { CrawlGribDataWorker }