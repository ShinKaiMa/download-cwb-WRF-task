import { Worker } from './Worker'
import { CrawlerUtil } from '../utils/CrawlerUtil';
import { CrawlGribDataWorker } from './CrawlGribDataWorker'
import { ScriptCaller } from './ScriptCaller'
import { WorkerQueue } from '../WorkerQueue/WorkerQueue'
import { cwbGribCrawlerConfig } from '../config/config.env'
import { generateKeyPair } from 'crypto';
import * as path from 'path'

/**
 * CrawlGribDataWorker and ScriptCaller dispatcher
 */
export class WeatherMapGenerator extends Worker {
    constructor(targetHourString: string) {
        super();
        if (!targetHourString) throw new Error("targetHourString is needed.")
        this.targetHourString = targetHourString;
    }
    private authToken = cwbGribCrawlerConfig.authToken;
    private targetHourString: string;
    private localGRBRootRepoDir = cwbGribCrawlerConfig.localGRBRootRepoDir;
    private localIMGRootRepoDir = cwbGribCrawlerConfig.localIMGRootRepoDir;
    private localPythonSourceCodeRootRepoDir = cwbGribCrawlerConfig.localPythonSourceCodeRootRepoDir;
    private localPythonSourceCodeFilePattern = cwbGribCrawlerConfig.localPythonSourceCodeFilePattern

    public async work() {
        let crawlGribDataWorker = new CrawlGribDataWorker({ targetHourString: this.targetHourString, localGRBRootRepoDir: this.localGRBRootRepoDir, authToken: this.authToken })
        let fetchedDir = await crawlGribDataWorker.fetchGRB();
        let source = cwbGribCrawlerConfig.source;
        let caller = new ScriptCaller("python", source, fetchedDir, this.targetHourString);
        await caller.callRepoScripts();
    }

    public async simuAsync() {
        return new Promise((resolve, reject) => {
            let second = 2;
            // let second = Math.floor(Math.random()*5)+1;
            // let second = 1;
            second *= 1000;
            setTimeout(function () {
                // console.log(self.targetHourString + " work! in " + second)
                resolve();
            }, second);
        })
    }

    public toString() {
        return `Forcast Hour{${this.targetHourString}} Handler`;
    }
}