import {CrawlGribDataWorker} from '../Worker/CrawlGribDataWorker'
var localGRBRootRepoDir = "0"
var authToken = "0"
var worker = new CrawlGribDataWorker({targetHourString:'00',localGRBRootRepoDir:localGRBRootRepoDir,authToken:authToken});
worker.simuAsync();