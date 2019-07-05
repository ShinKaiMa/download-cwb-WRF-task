import { CrawlGribDataWorker } from '../Worker/CrawlGribDataWorker'
import * as ProgressBar  from 'progress'

export class WorkerQueue {
    constructor(maxWorkerNum: number, threadNum: number) {
        this.maxWorkerNum = maxWorkerNum;
        this.threadNum = threadNum;
        if (!this.maxWorkerNum || !this.threadNum) {
            throw new Error("Param: max worker number and thread number is needed.");
        }
    }
    private maxWorkerNum: number;
    private threadNum: number;
    private workerQueue: CrawlGribDataWorker[] =[];
    private bar;

    public length():number{
        return this.workerQueue.length;
    }

    public poll(): CrawlGribDataWorker {
        if (this.workerQueue.length > 0) {
            return this.workerQueue.shift();
        }
        else {
            return undefined;
        }
    }

    public offer(worker: CrawlGribDataWorker): boolean {
        if (this.workerQueue.length < this.maxWorkerNum) {
            this.workerQueue.push(worker)
            return true;
        }
        else {
            return false;
        }
    }

    public process() {
        for (let initDispatchedWorkerNum = 0; initDispatchedWorkerNum <= this.threadNum; initDispatchedWorkerNum++) {
            this.tryDispatchOne();
        }
        // console.log('this.length: ' + this.length)
        this.bar = new ProgressBar('  WeatherMapProgress [:bar] :percent ETA: :etas', {
            complete: '=',
            incomplete: ' ',
            width: 50,
            total: this.length()
          });
    }

    private tryDispatchOne() {
        let worker = this.poll();
        if (worker) {
            worker.simuAsync().then(() => {
                // console.log('1 done');
                this.bar.tick(1);
                this.tryDispatchOne();
            }).catch((error) => {
                // console.log('1 fail');
                // console.log(error);
                this.bar.tick(1);
                this.tryDispatchOne();
            })
        }else if(!worker && this.workerQueue.length === 0){
            // console.log('done!');
        }
    }
}