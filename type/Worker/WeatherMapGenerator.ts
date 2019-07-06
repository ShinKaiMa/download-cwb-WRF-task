import {Worker} from './Worker'
import { CrawlerUtil } from '../utils/CrawlerUtil';
import {CrawlGribDataWorker} from './CrawlGribDataWorker'
import {ScriptCaller} from './ScriptCaller'
import {WorkerQueue} from '../WorkerQueue/WorkerQueue'
import {envConfig} from '../config/config.env'
import { generateKeyPair } from 'crypto';


/**
 * CrawlGribDataWorker and ScriptCaller dispatcher
 */
export class WeatherMapGenerator extends Worker{
    constructor(targetHourString:string){
        super();
        if(!targetHourString) throw new Error("targetHourString is needed.")
        this.targetHourString = targetHourString;
    }
    private authToken = envConfig.authToken;
    private targetHourString:string;
    private localGRBRootRepoDir = envConfig.localGRBRootRepoDir;
    private localIMGRootRepoDir = envConfig.localIMGRootRepoDir;
    private localPythonSourceCodeRootRepoDir = envConfig.localPythonSourceCodeRootRepoDir;
    private localPythonSourceCodeFilePattern = envConfig.localPythonSourceCodeFilePattern

    public async work(){
        let crawlGribDataWorker = new CrawlGribDataWorker({targetHourString:this.targetHourString,localGRBRootRepoDir:this.localGRBRootRepoDir,authToken:this.authToken})
        await crawlGribDataWorker.fetchGRB();
        // get all python directory;
        let pythonScriptDirs = CrawlerUtil.getAllDir(this.localPythonSourceCodeRootRepoDir + this.localPythonSourceCodeFilePattern);
        console.log(pythonScriptDirs)
    }

}