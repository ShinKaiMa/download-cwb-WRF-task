import * as child from 'child_process';

let scriptDir = "/home/shinkai/atmo-python-repo/CWB-WRF-3KM/near-tw/nearTW_CWB_WRF_3KM_SUR_windSpeed.py"
child.exec('python ' + scriptDir,function(error, stdout, stderr){
    console.info('stdout: ');
    console.log(stdout);
    console.info('stderr: ');
    console.log(stderr);
    if(error !== null){
      console.info('error: ');
      console.log(error);
    }
  });