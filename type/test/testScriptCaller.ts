import {ScriptCaller} from '../Worker/ScriptCaller'

let caller = new ScriptCaller();

let scriptDir =  "/media/sf_pygrib_playground_win/CWB-WRF-3KM-repo/Python-repo/nearTW/nearTW_CWB_WRF_3KM_700_VOR_BARB.py"
let grbDir = "/media/sf_pygrib_playground_win/CWB-WRF-3KM-repo/GRB-repo/20190703/06/CWB_WRF_3KM_000.grb2"

var test = caller.getIMGOutputDirByGRBDirAndScriptDir(grbDir,scriptDir);
console.log(test)