'use strict';
import { CrawlGribDataWorker } from "../CrawlGribDataWorker/CrawlGribDataWorker"
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';

var targetHourString:string = '000';
var localRootRepoDir: string = "D:\\CWB-GRB-WRF-3KM";

let worker: CrawlGribDataWorker = new CrawlGribDataWorker({ targetHourString: targetHourString, localRootRepoDir: localRootRepoDir });
worker.init();
// console.log(worker.tmpJSONFileName)
worker.fetchGRB();