import * as mongoose from 'mongoose';
import {DataStatus} from '../models/DataStatus.model';
import { CrawlerUtil } from '../utils/CrawlerUtil';

mongoose.connect('mongodb://localhost:27017/test', { useCreateIndex: true, useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', (err)=>console.log(err));
db.on('disconnected', ()=> mongoose.connect('mongodb://localhost:27017/test', { useCreateIndex: true, useNewUrlParser: true }));
db.once('open', async function () {

    let dataStatus = new DataStatus({
        dataType:"GRB",
        path:"testPath/13/12",
        status:"saved",
        byte:await CrawlerUtil.getFileSize("D:\\python_workspace\\pygrib_playground\\CWB-WRF-3KM-repo\\IMG-repo\\20190716\\18\\nearTW\\windspeed\\CWB_WRF_3km_nearTW_10m_windSpeed_Init_20197161800_FcstH_066.png")
    });

    dataStatus.save().then(()=>console.log("success")).catch((err)=>console.log(err));
    
    //ok
    // DataStatus.find({dataType:"GRB"},(err,docs)=>{
    //     console.log(err);
    //     console.log(docs);
    // });

    //ok
    // DataStatus.remove({_id:"5d2ae85a0376ed190ce98a4c"},(err)=>{
    //     console.log(err)

    //ok
    // testDataStatus.save().then(()=>console.log('save success')).catch(()=>console.log('save fail'));


    //ok
    // DataStatus.find({timeStamp:{"$gte": new Date(2019, 6, 15), "$lt": new Date(2020, 0, 0)}}).then((docs)=>{
    //     console.log('docs: ' + docs)
    // }).catch((err)=>console.log(`err : ${err}`))

    })
