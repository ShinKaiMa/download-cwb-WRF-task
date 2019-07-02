import {CrawlerUtil} from '../utils/CrawlerUtil';

async function test(){
    var test = await CrawlerUtil.loadJSON("D:\\CWB-WRF-Download-Task\\M-A0064-000.json")
    console.log(JSON.stringify(test))
}

test()