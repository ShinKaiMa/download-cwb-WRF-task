import * as path from 'path';
import { envConfig } from '../config/config.env'
import { CrawlerUtil } from '../utils/CrawlerUtil';
import { logger } from '../logger/logger';
import {DataStatus} from '../models/DataStatus.model';


export class ScriptCaller {
  constructor(commandPrefix: string, sourceGRBDir: string, targetHourString: string) {
    this.commandPrefix = commandPrefix;
    this.sourceGRBDir = sourceGRBDir;
    this.targetHourString = targetHourString;
  }
  public commandPrefix: string;
  public sourceGRBDir: string;
  private targetHourString: string;
  private localPythonSourceCodeRootRepoDir = envConfig.localPythonSourceCodeRootRepoDir;
  private localPythonSourceCodeFilePattern = envConfig.localPythonSourceCodeFilePattern;

  public async callRepoScripts(): Promise<void> {
    logger.debug(`using ScriptCaller: prefix- ${this.commandPrefix}, source GRB directory: ${this.sourceGRBDir} , target hour string: ${this.targetHourString}`)
    logger.debug(`local Python source code root repo directory: ${this.commandPrefix}`)
    logger.debug(`local Python source code file pattern: ${this.localPythonSourceCodeFilePattern}`)
    let isGRBNotComplete: boolean = false;
    try {
      let pythonScriptDirs = await CrawlerUtil.getAllDir(this.localPythonSourceCodeRootRepoDir + this.localPythonSourceCodeFilePattern);
      logger.debug(`python script dirs (before sort): ${pythonScriptDirs}`)
      pythonScriptDirs = CrawlerUtil.ensurePrecipScriptsBeLast(pythonScriptDirs);
      logger.debug(`python script dirs (after sort): ${pythonScriptDirs}`)
      for (let pythonScriptDir of pythonScriptDirs) {
        try {
          let IMGOutputDir = this.getIMGOutputDirByGRBDirAndScriptDir(this.sourceGRBDir, pythonScriptDir);
          await CrawlerUtil.ensureDir(IMGOutputDir);
          logger.debug(`IMG Output Dir: ${IMGOutputDir}`)
          // get all png path in IMGOutputDir
          let allIMGDirs = await CrawlerUtil.getAllDir(IMGOutputDir + path.sep + "*.png");
          // check img is exist or not
          let isNeedToSkip: boolean = false;
          for (let IMGDir of allIMGDirs) {
            // determin img already exist or not
            if (IMGDir.includes(this.targetHourString + ".png")) {
              isNeedToSkip = true;
            }
          }
          // start to draw
          if (!isNeedToSkip) {
            await CrawlerUtil.execShellCommand(`${this.commandPrefix} ${pythonScriptDir} ${this.sourceGRBDir} ${IMGOutputDir}`);
            logger.info(`Complete command: ${this.commandPrefix} ${pythonScriptDir} ${this.sourceGRBDir} ${IMGOutputDir}`)
            // get output image directory
            let IMGDirs = await CrawlerUtil.getAllDir(IMGOutputDir + path.sep + "*" + this.targetHourString + "*");
            logger.debug(`estimate IMGDirs: ${IMGDirs}`)
            let dataStatus = new DataStatus({
              dataType:"IMG",
              path:IMGDirs[0],
              status:"saved",
              byte:await CrawlerUtil.getFileSize(IMGDirs[0])
          });
          await dataStatus.save();
          logger.debug(`save ${JSON.stringify(dataStatus)} success.`)
          } else {
            logger.info(`Skip command: ${this.commandPrefix} ${pythonScriptDir} ${this.sourceGRBDir} ${IMGOutputDir}`)
          }
        } catch (error) {
          // TODO determine precip continue situ
          if (!pythonScriptDir.includes("{Final}")) {
            isGRBNotComplete = true;
            logger.error(`Exception encountered when using command: ${this.commandPrefix} ${pythonScriptDir}`);
            logger.error(error);
          }else{
            logger.debug(`skip determine var:isGRBNotComplete cause ${pythonScriptDir} includes "{Final}" (precip), var value: ${isGRBNotComplete} `);
          }
        }
      }
    } catch (error) {
      logger.error(`Exception encountered when listing all driectory, directory regex: ${this.localPythonSourceCodeRootRepoDir + this.localPythonSourceCodeFilePattern}`);
      logger.error(error);
    } finally {
      if (isGRBNotComplete) {
        try {
          // TODO sort script list
          let GRBSize = await CrawlerUtil.getFileSize(this.sourceGRBDir);
          logger.error(`${this.sourceGRBDir} size: ${GRBSize} bytes, maybe not complete size.`);
          await CrawlerUtil.remove(this.sourceGRBDir)
          logger.error(`remove surce grib ${this.sourceGRBDir} success.`);
        } catch (error) {
          logger.warn(`can not remove surce grib ${this.sourceGRBDir}.`);
        }
      }
    }
  }

  public getIMGOutputDirByGRBDirAndScriptDir(GRBDir: string, ScriptDir: string) {
    let GRB_ROOT_FileName_Array = envConfig.localGRBRootRepoDir.split(path.sep);
    let GRB_ROOT_FileName = GRB_ROOT_FileName_Array[GRB_ROOT_FileName_Array.length - 1];
    let IMG_ROOT_FileName_Array = envConfig.localIMGRootRepoDir.split(path.sep);
    let IMG_ROOT_FileName = IMG_ROOT_FileName_Array[IMG_ROOT_FileName_Array.length - 1];
    let SCRIPT_ROOT_FileName_Array = ScriptDir.split(path.sep);
    let SCRIPT_ROOT_FileName = SCRIPT_ROOT_FileName_Array[SCRIPT_ROOT_FileName_Array.length - 3] + path.sep + SCRIPT_ROOT_FileName_Array[SCRIPT_ROOT_FileName_Array.length - 2];
    // let SCRIPT_ROOT_FileName = SCRIPT_ROOT_FileName_Array[SCRIPT_ROOT_FileName_Array.length - 2];
    let GRBDirArray = GRBDir.split(path.sep);
    GRBDirArray.pop();
    GRBDir = GRBDirArray.join(path.sep);
    GRBDir = path.join(GRBDir, SCRIPT_ROOT_FileName)
    let IMG_ROOT_Output = GRBDir.replace(GRB_ROOT_FileName, IMG_ROOT_FileName)
    return IMG_ROOT_Output;
  }

}