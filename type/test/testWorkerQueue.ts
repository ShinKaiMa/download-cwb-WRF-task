import { WorkerQueue } from '../WorkerQueue/WorkerQueue';
import { CrawlGribDataWorker } from '../Worker/CrawlGribDataWorker';
import {WeatherMapGenerator} from '../Worker/WeatherMapGenerator'
import { envConfig } from '../config/config.env'
import * as ProgressBar  from 'progress'
import { logger } from '../logger/logger';

const localGRBRootRepoDir = "test";
const authToken = "test";

var queue = new WorkerQueue(envConfig.targetHourStrings.length, envConfig.threadNum);
for (let targetHourString of envConfig.targetHourStrings) {
    logger.info(`Triger target hour "${targetHourString}" weather map generator.`)
    // let worker = new CrawlGribDataWorker({ targetHourString: num.toString(), localGRBRootRepoDir: localGRBRootRepoDir, authToken: authToken })
    let worker = new WeatherMapGenerator(targetHourString);
    let bool = queue.offer(worker);
}


queue.process();