import {CrawlerUtils} from '../utils/CrawlerUtils';

async function test(){
    var test = await CrawlerUtils.loadJSON("D:\\CWB-WRF-Download-Task\\M-A0064-000.json")
    console.log(JSON.stringify(test))
}

test()