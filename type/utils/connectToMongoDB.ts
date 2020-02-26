import { cwbGribCrawlerConfig } from '../config/config.env';
import { logger } from '../logger/logger';
import mongoose = require('mongoose');


const connectToMongoDB = async () => {
    try {
        mongoose.set('useCreateIndex', true);
        await mongoose.connect(cwbGribCrawlerConfig.databaseURL, { useNewUrlParser: true })
        logger.info(`Connected to ${cwbGribCrawlerConfig.databaseURL} successfully`);
    } catch (error) {
        logger.error(`Can not initilize DataBase : ${cwbGribCrawlerConfig.databaseURL}, reason: ${error}`);
        process.exit(1);
    }
}

export { connectToMongoDB }