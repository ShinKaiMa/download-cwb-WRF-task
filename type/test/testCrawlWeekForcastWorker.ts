import CrawlWeekForcastWorker from "../Worker/CrawlWeekForcastWorker"
import { OneWeeakForcast } from "../models/OneWeekForcast.model"
import * as mongoose from 'mongoose';
import { connectToMongoDB } from "../utils/connectToMongoDB"



const test = async () => {
    try {
        await connectToMongoDB();
        // let worker = new CrawlWeekForcastWorker();
        // await worker.work();

        // let test = new OneWeeakForcast({
        //     location:[{test:"a"}]
        // })
        // await test.save()

        let result = await OneWeeakForcast.find({timeStamp: new Date("2020-02-26T10:09:42.131+00:00")}).exec();
        console.log(result[0].toJSON())
    } catch (error) {
        console.log(error)
    }
}



test();