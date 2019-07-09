import { CrawlGribDataWorker } from '../Worker/CrawlGribDataWorker'
import { Worker } from '../Worker/Worker'
import * as ProgressBar from 'progress'

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
    private workerQueue: Worker[] = [];
    private requestNums: number = 0;
    private doneNums: number = 0;
    private bar;

    public length(): number {
        return this.workerQueue.length;
    }

    public poll(): Worker {
        if (this.workerQueue.length > 0) {
            return this.workerQueue.shift();
        }
        else {
            return undefined;
        }
    }

    public offer(worker: Worker): boolean {
        if (this.length() < this.maxWorkerNum) {
            this.workerQueue.push(worker);
            this.requestNums++;
            return true;
        }
        else {
            return false;
        }
    }

    public process() {
        this.bar = new ProgressBar('  WeatherMapProgress [:bar] :percent ETA: :etas :message', {
            complete: '=',
            incomplete: ' ',
            width: 50,
            total: this.length()
        });
        this.bar.tick(0,{
            message:`Starting Progress.`
        })
        for (let initDispatchedWorkerNum = 0; initDispatchedWorkerNum < this.threadNum; initDispatchedWorkerNum++) {
            this.tryDispatchOne();
        }
    }

    private tryDispatchOne() {
        let worker = this.poll();
        if (worker) {
            worker.work().then(() => {
                // console.log('1 done');
                this.bar.tick(1,{
                    message:`${worker.toString()} mission complete.`
                });
                this.doneNums++;
                this.tryDispatchOne();
            }).catch((error) => {
                // console.log('1 fail');
                // console.log(error);
                this.bar.tick(1,{
                    message:`${worker.toString()} mission complete.`
                });
                this.doneNums++;
                this.tryDispatchOne();
            })
        } else if (this.requestNums === this.doneNums) {
            console.log('complete!');
        }
    }
}