import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import axios from "axios";
import { logger } from '../logger/logger';
import * as glob from 'glob';


export class CrawlerUtil {
    public static async downloadFileToPath(url: string, localPath: string) {
        try {
            let response = await axios.get(url, { responseType: "stream" });
            response.data.pipe(fs.createWriteStream(localPath));
        }
        catch (error) {
            logger.info(error)
        }
    }

    public static async ensureDir(directory: string) {
        return new Promise((resolve, reject) => {
            mkdirp(directory, function (error) {
                if (error) {
                    logger.info(error);
                    reject(error);
                }
                else {
                    resolve();
                }
            })
        })
    }

    public static async isPathExist(directory: string): Promise<boolean> {
        try {
            await fs.promises.access(directory);
            return true;
        } catch (error) {
            logger.info(error);
            return false;
        }
    }

    public static async loadJSON(sourcePath: string): Promise<any> {
        return new Promise((resolve, reject) => {
            fs.readFile(sourcePath, (error, data) => {
                if (error) {
                    logger.info(error);
                    reject(error);
                }
                let json = JSON.parse(data.toString('utf8'));
                resolve(json);
            });
        });
    }

    public static async remove(fileDir: string): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.unlink(fileDir, (error) => {
                if (error) {
                    logger.info(error);
                    reject(error);
                } else {
                    resolve();
                }
            })
        })
    }

    public static async getAllDir(directoryReg:string):Promise<string[]>{
        return new Promise((resolve, reject) => {
            glob(directoryReg,  function (error, files) {
                if(error) reject(error);
                resolve(files)
              })
        })
    }
}