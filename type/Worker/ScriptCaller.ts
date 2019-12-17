import * as path from 'path';
import { cwbGribCrawlerConfig } from '../config/config.env'
import { CrawlerUtil } from '../utils/CrawlerUtil';
import { logger } from '../logger/logger';
import { DataStatus, IDataStatus } from '../models/DataStatus.model';


export class ScriptCaller {
  //TODO input config without ...args
  constructor(commandPrefix: string, source: string, sourceGRBDir: string, targetHourString: string) {
    this.commandPrefix = commandPrefix;
    this.source = source;
    this.sourceGRBDir = sourceGRBDir;
    this.targetHourString = targetHourString;
  }
  public commandPrefix: string;
  private source: string;
  public sourceGRBDir: string;
  private targetHourString: string;
  private localPythonSourceCodeRootRepoDir = cwbGribCrawlerConfig.localPythonSourceCodeRootRepoDir;
  private localPythonSourceCodeFilePattern = cwbGribCrawlerConfig.localPythonSourceCodeFilePattern;

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
            let detailType = CrawlerUtil.extractDetailTypeFromScriptDir(pythonScriptDir);
            if (IMGDir.includes(this.targetHourString + ".png") && IMGDir.includes(detailType)) {
              isNeedToSkip = true;
            }
          }
          // start to draw
          if (!isNeedToSkip) {
            await CrawlerUtil.execShellCommand(`${this.commandPrefix} ${pythonScriptDir} ${this.sourceGRBDir} ${IMGOutputDir}`);
            logger.info(`Complete command: ${this.commandPrefix} ${pythonScriptDir} ${this.sourceGRBDir} ${IMGOutputDir}`)
            // get output image directory
            let estimateDetailType = CrawlerUtil.extractDetailTypeFromScriptDir(pythonScriptDir);
            logger.debug(`estimateDetailType: ${estimateDetailType}`);
            let outputIMGDirs = await CrawlerUtil.getAllDir(IMGOutputDir + path.sep + "*" + estimateDetailType + "*" + "FcstH_" + this.targetHourString + "*");
            logger.debug(`estimate IMGDirs: ${outputIMGDirs}`)
            let parsedIMGDir = outputIMGDirs[0].split(path.sep);
            let area = parsedIMGDir[parsedIMGDir.length - 3];
            let dataType = parsedIMGDir[parsedIMGDir.length - 2];
            logger.debug(`parsedIMGDir: ${parsedIMGDir}, area: ${area}, dataType: ${dataType}`);
            let dateString = parsedIMGDir[5]; //example:20190721
            let startYear: number = parseInt(dateString.slice(0, 4));
            let startMonth: number = parseInt(dateString.slice(4, 6)) - 1;
            let startDay: number = parseInt(dateString.slice(6));
            let startHour = parseInt(parsedIMGDir[6]);
            let startDate = new Date(Date.UTC(startYear, startMonth, startDay, startHour));
            let forcastHour = parseInt(this.targetHourString);
            logger.debug(`startDate: ${startDate}`);
            let dataStatus = new DataStatus({
              source: this.source,
              fileType: "IMG",
              area: area,
              dataType,
              detailType: CrawlerUtil.extractDetailTypeFromScriptDir(pythonScriptDir),
              path: outputIMGDirs[0],
              status: "saved",
              byte: await CrawlerUtil.getFileSize(outputIMGDirs[0]),
              startDate: startDate,
              endDate: pythonScriptDir.includes("{Final}") ? new Date(startDate.getTime() + 6 * 60 * 60 * 1000) : startDate,
              forcastHour: forcastHour,
              incrementHours: pythonScriptDir.includes("{Final}") ? 6 : 0
            });
            await dataStatus.save();
            logger.debug(`save ${JSON.stringify(dataStatus)} success.`)
          } else {
            logger.info(`Skip command: ${this.commandPrefix} ${pythonScriptDir} ${this.sourceGRBDir} ${IMGOutputDir}`)
          }
        } catch (error) {
          if (!pythonScriptDir.includes("{Final}")) {
            isGRBNotComplete = true;
            logger.error(`Exception encountered when using command: ${this.commandPrefix} ${pythonScriptDir}`);
            logger.error(error);
          } else {
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
          let GRBSize = await CrawlerUtil.getFileSize(this.sourceGRBDir);
          logger.error(`${this.sourceGRBDir} size: ${GRBSize} bytes, maybe not complete size.`);
          await CrawlerUtil.remove(this.sourceGRBDir)
          logger.error(`Remove source grib ${this.sourceGRBDir} success.`);
          logger.debug(`saving this.sourceGRBDir ${this.sourceGRBDir}.`);
          let previuosGRBStatus: IDataStatus = await DataStatus.findOne({ status: "saved", path: this.sourceGRBDir }).sort({ timeStamp: -1 }).exec();
          previuosGRBStatus.status = "fail";
          await previuosGRBStatus.save();
        } catch (error) {
          logger.warn(`Error: ${error}`);
          logger.warn(`Can not remove surce grib ${this.sourceGRBDir}, or can not log status to DB.`);
        }
      }
    }
  }

  public getIMGOutputDirByGRBDirAndScriptDir(GRBDir: string, ScriptDir: string) {
    let GRB_ROOT_FileName_Array = cwbGribCrawlerConfig.localGRBRootRepoDir.split(path.sep);
    let GRB_ROOT_FileName = GRB_ROOT_FileName_Array[GRB_ROOT_FileName_Array.length - 1];
    let IMG_ROOT_FileName_Array = cwbGribCrawlerConfig.localIMGRootRepoDir.split(path.sep);
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