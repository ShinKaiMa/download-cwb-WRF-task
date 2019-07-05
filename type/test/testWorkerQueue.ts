import { WorkerQueue } from '../WorkerQueue/WorkerQueue';
import { CrawlGribDataWorker } from '../Worker/CrawlGribDataWorker';
import * as ProgressBar  from 'progress'

const localGRBRootRepoDir = "test";
const authToken = "test";


var queue = new WorkerQueue(10, 2);
for (let num = 1; num <= 10; num++) {
    let worker = new CrawlGribDataWorker({ targetHourString: num.toString(), localGRBRootRepoDir: localGRBRootRepoDir, authToken: authToken })
    queue.offer(worker);
}



queue.process();