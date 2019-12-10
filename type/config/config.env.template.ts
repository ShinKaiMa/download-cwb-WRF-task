interface gribCrawlerConfig {
    databaseURL?:string,
    authToken: string,
    source: string,
    localGRBRootRepoDir: string,
    localIMGRootRepoDir: string,
    localPythonSourceCodeRootRepoDir: string,
    localPythonSourceCodeFilePattern:string,
    targetHourStrings?: string[],
    maxHour: number,
    increment: number,
    threadNum:number
}

let cwbGribCrawlerConfig: gribCrawlerConfig = {
    databaseURL: 'mongodb://localhost:27017/test',
    authToken: "your CWB open data token",
    source:'CWB WRF 3KM',
    localGRBRootRepoDir: "your local GRIB file root repository directory to store CWB open data",
    localIMGRootRepoDir: "your local image file root repository directory",
    localPythonSourceCodeRootRepoDir: "your local python script file root repository directory",
    localPythonSourceCodeFilePattern: "local python script file pattern related to localPythonSourceCodeRootRepoDir,example: /**/**/*.py",
    maxHour: 84,
    increment: 6,
    threadNum: 2
}

let targetHourStrings: string[] = []
for (let availableHour = 0; availableHour <= cwbGribCrawlerConfig.maxHour; availableHour += cwbGribCrawlerConfig.increment) {
    targetHourStrings.push(availableHour.toString().padStart(3, "0"));
}

cwbGribCrawlerConfig.targetHourStrings = targetHourStrings


export { cwbGribCrawlerConfig }