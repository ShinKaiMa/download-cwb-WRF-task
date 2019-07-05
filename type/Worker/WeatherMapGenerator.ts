import {CrawlGribDataWorker} from './CrawlGribDataWorker'
import {ScriptCaller} from './ScriptCaller'
import {envConfig} from '../config/config.env'

export class WeatherMapGenerator{
    private authToken = envConfig.authToken;
    private targetHourStrings = envConfig.targetHourStrings;
    private localGRBRootRepoDir = envConfig.localGRBRootRepoDir;
    private localPythonSourceCodeRootRepoDir = envConfig.localPythonSourceCodeRootRepoDir;

    public test(){
        console.log(this.localPythonSourceCodeRootRepoDir);
    }
}