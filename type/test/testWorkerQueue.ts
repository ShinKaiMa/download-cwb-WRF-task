import { WorkerQueue } from '../WorkerQueue/WorkerQueue';
import { CrawlGribDataWorker } from '../Worker/CrawlGribDataWorker';
import {WeatherMapGenerator} from '../Worker/WeatherMapGenerator'
import { cwbGribCrawlerConfig } from '../config/config.env'
import * as ProgressBar  from 'progress'
import { logger } from '../logger/logger';

const localGRBRootRepoDir = "test";
const authToken = "test";

var queue = new WorkerQueue(cwbGribCrawlerConfig.targetHourStrings.length, cwbGribCrawlerConfig.threadNum);
for (let targetHourString of cwbGribCrawlerConfig.targetHourStrings) {
    logger.info(`Triger target hour "${targetHourString}" weather map generator.`)
    // let worker = new CrawlGribDataWorker({ targetHourString: num.toString(), localGRBRootRepoDir: localGRBRootRepoDir, authToken: authToken })
    let worker = new WeatherMapGenerator(targetHourString);
    let bool = queue.offer(worker);
}


queue.process();