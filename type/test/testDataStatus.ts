import * as mongoose from 'mongoose';
import {DataStatus,IDataStatus} from '../models/DataStatus.model';
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

    // dataStatus.save().then(()=>console.log("success")).catch((err)=>console.log(err));
    
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

    // DataStatus.findOne({startDate:new Date(2019,7,21,8),})

    //ok
    // DataStatus.findOne({path:'/media/sf_pygrib_playground_win/CWB-WRF-3KM-repo/GRB-repo/20190721/06/CWB_WRF_3KM_000.grb2',startDate:new Date(2019,6,21,14)},async (err,doc)=>{
    //     console.log(err);
    //     console.log(doc.startDate);
    //     doc.status='testStatus'
    //     await doc.save();
    // })


    //ok
    // let test:IDataStatus = await DataStatus.findOne({path:'/media/sf_pygrib_playground_win/CWB-WRF-3KM-repo/GRB-repo/20190721/06/CWB_WRF_3KM_000.grb2',startDate:new Date(2019,6,21,14)})
    // console.log(test);

    // not ok
    // let previuosGRBStatus:IDataStatus = await DataStatus.findOne({sort:{'timeStamp':-1},status:"testStatus",path:"/media/sf_pygrib_playground_win/CWB-WRF-3KM-repo/GRB-repo/20190721/06/CWB_WRF_3KM_000.grb2"});
    // console.log(previuosGRBStatus)

    //ok
    // let previuosGRBStatus:IDataStatus = await DataStatus.findOne({status:"testStatus",path:"/media/sf_pygrib_playground_win/CWB-WRF-3KM-repo/GRB-repo/20190721/06/CWB_WRF_3KM_000.grb2"}).sort({timeStamp:-1}).exec();
    // console.log(previuosGRBStatus)

    //ok, use local time stamp to query utc time stamp in mongodb
    //in mongodb, can  use {timeStamp:{$gte:new ISODate('2019-07-25T14:00:00Z')}} to find (node.js (mongoose) not work in this way)
    // let previuosGRBStatus:IDataStatus[] = await DataStatus.find({timeStamp:{$gte:new Date(2019,6,25,22)}}).exec();
    // console.log(previuosGRBStatus);

    //ok, use UTC time stamp to query utc time stamp in mongodb
    let previuosGRBStatus:IDataStatus[] = await DataStatus.find({timeStamp:{$gte:new Date(Date.UTC(2019,6,25,14))}}).exec();
    console.log(previuosGRBStatus);


    })
