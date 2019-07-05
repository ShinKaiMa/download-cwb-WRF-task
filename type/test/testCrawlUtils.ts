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

    var dirs = await CrawlerUtil.getAllDir('D:\\python_workspace\\pygrib_playground\\CWB-WRF-3KM-repo\\Python-repo\\**\\*.py');
    console.log(dirs)
}

test()