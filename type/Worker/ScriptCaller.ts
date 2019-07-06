import * as child_process from 'child_process';
import * as path from 'path';
import {envConfig} from '../config/config.env'


export class ScriptCaller {
  public scriptDir: string;
  public commandPrefix: string;
  public args: string[];


  public async call(): Promise<any> {
    return new Promise((resolve, reject) => {
      child_process.exec(this.commandPrefix + ' ' + this.scriptDir + ' ' + this.args.join(' '), function (error, stdout, stderr) {
        resolve(stdout);
        reject(stderr)
        if (error !== null) {
          reject(error)
        }
      })
    })
  }

  public getIMGOutputDirByGRBDirAndScriptDir(GRBDir:string, ScriptDir:string){
    let GRB_ROOT_FileName_Array = envConfig.localGRBRootRepoDir.split(path.sep);
    let GRB_ROOT_FileName = GRB_ROOT_FileName_Array[GRB_ROOT_FileName_Array.length-1];
    let IMG_ROOT_FileName_Array = envConfig.localIMGRootRepoDir.split(path.sep);
    let IMG_ROOT_FileName = IMG_ROOT_FileName_Array[IMG_ROOT_FileName_Array.length-1];
    let SCRIPT_ROOT_FileName_Array = ScriptDir.split(path.sep);
    let SCRIPT_ROOT_FileName = SCRIPT_ROOT_FileName_Array[SCRIPT_ROOT_FileName_Array.length-2];
    let GRBDirArray = GRBDir.split(path.sep);
    GRBDirArray.pop();
    GRBDir = GRBDirArray.join(path.sep);
    GRBDir = path.join(GRBDir,SCRIPT_ROOT_FileName)
    let IMG_ROOT_Output = GRBDir.replace(GRB_ROOT_FileName,IMG_ROOT_FileName)
    return IMG_ROOT_Output;
  }

}