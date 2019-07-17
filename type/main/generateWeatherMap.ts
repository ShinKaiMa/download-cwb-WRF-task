import { WorkerQueue } from '../WorkerQueue/WorkerQueue';
import { WeatherMapGenerator } from '../Worker/WeatherMapGenerator'
import { envConfig } from '../config/config.env'
import { logger } from '../logger/logger';
import * as mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/test', { useCreateIndex: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (err)=>console.log(err));
db.on('disconnected', ()=> setTimeout(() => {
    mongoose.connect('mongodb://localhost:27017/test', { useCreateIndex: true, useNewUrlParser: true })
}, 10000));

let isSuccessQueue = true;

var queue = new WorkerQueue(envConfig.targetHourStrings.length, envConfig.threadNum);
for (let targetHourString of envConfig.targetHourStrings) {
    logger.info(`Triger target hour "${targetHourString}" weather map generator.`)
    // let worker = new CrawlGribDataWorker({ targetHourString: num.toString(), localGRBRootRepoDir: localGRBRootRepoDir, authToken: authToken })
    let worker = new WeatherMapGenerator(targetHourString);
    if (queue.offer(worker)) {
        logger.debug(`Offered ${worker.toString()} successfully.`)
    } else {
        logger.error(`Can not offered ${worker.toString()}, please check configuration.`);
        logger.error(`Config  content: targetHourStrings - ${envConfig.targetHourStrings.length}.`);
        logger.error(`Config content: threadNum - ${envConfig.threadNum}.`);
        isSuccessQueue = false;
        break;
    };
}

if (isSuccessQueue) queue.process();