import * as path from 'path';
import {CrawlerUtil} from '../utils/CrawlerUtil';

async function test(){
    // var test = await CrawlerUtil.loadJSON("D:\\CWB-WRF-Download-Task\\M-A0064-000.json")
    // console.log(JSON.stringify(test))

    // await CrawlerUtil.remove("D:\\CWB-WRF-Download-Task\\test.txt")

    // try{
    //     await CrawlerUtil.ensureDir("D:\\CWB-GRB-WRF-3KM\\test")
    // }
    // catch(error){
    //     console.log(error)
    // }

    // var bool = await CrawlerUtil.isPathExist("D:/CWB-GRB-WRF-3KM")
    // console.log(bool)

    // var dirs = await CrawlerUtil.getAllDir('D:\\python_workspace\\pygrib_playground\\CWB-WRF-3KM-repo\\Python-repo\\**\\*.py');
    // console.log(dirs)

    // let fileSize = await CrawlerUtil.getFileSize('D:\\python_workspace\\pygrib_playground\\CWB-WRF-3KM-repo\\GRB-repo\\20190713\\00\\CWB_WRF_3KM_006.grb2')
    // console.log(fileSize)

    // let scriptsPath = ["/media/sf_pygrib_playground_win/CWB-WRF-3KM-repo/Python-repo/nearTW/preccipitation/{Final}nearTW_CWB_WRF_3KM_850_Wind_Precip.py","/media/sf_pygrib_playground_win/CWB-WRF-3KM-repo/Python-repo/nearTW/temperature/{Final}nearTW_CWB_WRF_3KM_SUR_TEMP.py","/media/sf_pygrib_playground_win/CWB-WRF-3KM-repo/Python-repo/nearTW/vorticity/nearTW_CWB_WRF_3KM_700_VOR_BARB.py","/media/sf_pygrib_playground_win/CWB-WRF-3KM-repo/Python-repo/nearTW/windspeed/nearTW_CWB_WRF_3KM_SUR_windSpeed.py","/media/sf_pygrib_playground_win/CWB-WRF-3KM-repo/Python-repo/TW/precipitation/TWArea_CWB_WRF_3KM_SUR_PRECIP_BARB.py"]
    // console.log(CrawlerUtil.ensurePrecipScriptsBeLast(scriptsPath))

    let IMGDirs = await CrawlerUtil.getAllDir("D:\\python_workspace\\pygrib_playground\\CWB-WRF-3KM-repo\\IMG-repo\\20190716\\18\\nearTW\\windspeed" + path.sep + "*000" + "*");
    console.log(IMGDirs)
}

test()