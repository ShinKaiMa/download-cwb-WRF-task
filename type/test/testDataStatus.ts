import * as mongoose from 'mongoose';
import {DataStatus} from '../models/DataStatus.model';

mongoose.connect('mongodb://localhost:27017/test');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function () {

    let testDataStatus = new DataStatus({
        dataType:"GRB",
        path:"/home/test.png",
        timeStamp:new Date()
    });
    
    testDataStatus.save();
})
