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

    public static async loadJSON(sourcePath:string):Promise<any>{
        return new Promise((resolve, reject) => {
            fs.readFile(sourcePath, (error, data) => {  
                if (error){
                    reject(error);
                }
                let json = JSON.parse(data.toString('utf8'));
                resolve(json);
                console.log(json);
            });
        });
    }
}