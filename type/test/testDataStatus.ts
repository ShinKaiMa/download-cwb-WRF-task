import * as mongoose from 'mongoose';
import {DataStatus} from '../models/DataStatus.model';

mongoose.connect('mongodb://localhost:27017/test');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function () {

    let testDataStatus = new DataStatus({
        dataType:"GRB",
        path:"/home/test.png",
    });
    
    // DataStatus.find({dataType:"GRB"},(err,docs)=>{
    //     console.log(err);
    //     console.log(docs);
    // });
    DataStatus.remove({_id:"5d2ae85a0376ed190ce98a4c"},(err)=>{
        console.log(err)
    })
    // testDataStatus.save().then(()=>console.log('save success')).catch(()=>console.log('save fail'));
})
