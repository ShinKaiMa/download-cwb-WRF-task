'use strict';
import { CrawlGribDataWorker } from "../CrawlGribDataWorker/CrawlGribDataWorker"
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';

var url: string = "https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/M-A0064-000?Authorization=CWB-6EEFC71A-2A8A-4F48-B579-930516FD5A33&downloadType=WEB&format=JSON";
var destination: string = "D:\\CWB-WRF-Download-Task";

let worker: CrawlGribDataWorker = new CrawlGribDataWorker({ targetURL: url, localGribDestination: destination });
// console.log(worker.getNearestTimePath())


const path = ''
async function test() {
    try {
        await fs.promises.access("C:\\node_workspace\\CWB-DATA-CRAWLER\\download-cwb-WRF-task");
        console.log('ok')
        // The check succeeded
    } catch (error) {
        // The check failed
        console.log(error)
    }
}

// test()
async function mmm() {
    try {
        await mkdirp("D:\\CWB-GRB-WRF-3KM\\20190701\\00")
    } catch (error) {
        console.log(error)
    }
}
mmm()