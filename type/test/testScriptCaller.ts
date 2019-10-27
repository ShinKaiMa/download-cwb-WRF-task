import {ScriptCaller} from '../Worker/ScriptCaller'


let scriptDir =  "/home/shinkai/CWB-WRF-3KM-repo/Python-repo/nearTW/nearTW_CWB_WRF_3KM_700_VOR_BARB.py"
let grbDir = "/home/shinkai/CWB-WRF-3KM-repo/GRB-repo/20190708/12/CWB_WRF_3KM_000.grb2"
let caller = new ScriptCaller("python","CWB WRF 3KM",grbDir,"000");

// var test = caller.getIMGOutputDirByGRBDirAndScriptDir(grbDir,scriptDir);
// console.log(test)
caller.callRepoScripts();