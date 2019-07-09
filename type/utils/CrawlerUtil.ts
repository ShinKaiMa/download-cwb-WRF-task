import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import axios from "axios";
import { logger } from '../logger/logger';
import * as glob from 'glob';
import * as child_process from 'child_process';


export class CrawlerUtil {
    public static async downloadFileToPath(url: string, localPath: string):Promise<void> {
        try {
            let response = await axios.get(url, { responseType: "stream" });
            const writer = fs.createWriteStream(localPath)
            response.data.pipe(writer);

            return new Promise((resolve, reject) => {
                writer.on('finish', resolve)
                writer.on('error', reject)
            })
        }
        catch (error) {
            logger.error(error)
            return new Promise((resolve, reject) => {
                reject(error)
            })
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
            // logger.error(error);
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

    public static getAllDir(directoryReg: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            glob(directoryReg, function (error, files) {
                if (error) reject(error);
                resolve(files)
            })
        })
    }

    public static execShellCommand(command: string): Promise<string> {
        return new Promise((resolve, reject) => {
            child_process.exec(command, function (error, stdout, stderr) {
                if (error) reject(error);
                if (stderr) logger.error(stderr)
                // if(stderr.includes("selectValueError")) reject(stderr)
                resolve(stdout);
            })
        })
    }
}