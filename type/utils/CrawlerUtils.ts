import * as fs from 'fs';
import mkdirp from 'mkdirp';
import axios from "axios";
export class CrawlerUtils{
    public static async downloadFileToPath(url: string, localPath: string) {
        try {
            let response = await axios.get(url, { responseType: "stream" });
            response.data.pipe(fs.createWriteStream(localPath));
        }
        catch (error) {
            console.log(error)
        }
    }

    public static async ensureDir(directory:string) {
        try {
            await mkdirp(directory)
        } catch (error) {
            console.log(error);
        }
    }

    public static async isPathExist(directory:string):Promise<boolean>{
        try {
            await fs.promises.access(directory);
            return true;
        } catch (error) {
            return false;
        }
    }
}