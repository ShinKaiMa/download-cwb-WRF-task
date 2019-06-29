'use strict';
import {CrawlGribDataWorker} from "../CrawlGribDataWorker/CrawlGribDataWorker"

var url: string = "https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/M-A0064-000?Authorization=CWB-6EEFC71A-2A8A-4F48-B579-930516FD5A33&downloadType=WEB&format=JSON";
var destination: string = "D:\\CWB-WRF-Download-Task";

let worker: CrawlGribDataWorker = new CrawlGribDataWorker({ targetURL: url, localGribDestination: destination });
worker.getDescriptJSON();