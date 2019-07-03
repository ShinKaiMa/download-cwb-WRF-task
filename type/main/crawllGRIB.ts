'use strict';
import { CrawlGribDataWorker } from "../Worker/CrawlGribDataWorker"
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';

var targetHourString:string = '000';
// var localRootRepoDir: string = "D:\\CWB-GRB-WRF-3KM";
var localRootRepoDir: string = "/media/sf_pygrib_playground_win/CWB-WRF-3KM-repo";
var authToken:string = 'CWB-6EEFC71A-2A8A-4F48-B579-930516FD5A33'
let worker: CrawlGribDataWorker = new CrawlGribDataWorker({ targetHourString: targetHourString, localRootRepoDir: localRootRepoDir, authToken:authToken });
// console.log(worker.tmpJSONFileName)
worker.fetchGRB();