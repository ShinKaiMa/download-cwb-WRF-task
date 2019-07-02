import {CrawlGribDataWorker} from '../CrawlGribDataWorker/CrawlGribDataWorker'
var worker = new CrawlGribDataWorker({targetHourString:'00'});

console.log('123: '+worker.getNearestTimeDir());