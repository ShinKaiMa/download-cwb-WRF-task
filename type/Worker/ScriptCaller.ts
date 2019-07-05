import * as child_process from 'child_process';

interface ScriptCallerConfig {
  scriptDirs:string[]
  commandPrefix: string
  args: string[]
}

export class ScriptCaller {
  constructor(config:ScriptCallerConfig) {
    this.scriptDirs = config.scriptDirs;
    this.commandPrefix = config.commandPrefix;
    this.args = config.args;
  }
  private scriptDirs: string[];
  private commandPrefix: string;
  private args: string[];
  public async call(): Promise<any> {
    return new Promise((resolve, reject) => {
      child_process.exec(this.commandPrefix + ' ' + this.scriptDirs +  this.args.join(' '), function (error, stdout, stderr) {
        resolve(stdout);
        reject(stderr)
        if (error !== null) {
          reject(error)
        }
      })
    })
  }
}