interface envConfig {
    authToken: string,
    localGRBRootRepoDir: string,
    localIMGRootRepoDir: string,
    localPythonSourceCodeRootRepoDir: string,
    targetHourStrings?: string[],
    maxHour: number,
    increment: number
}

let envConfig: envConfig = {
    authToken: "your CWB open data token",
    localGRBRootRepoDir: "your local GRIB file root repository directory to store CWB open data",
    localIMGRootRepoDir: "your local image file root repository directory",
    localPythonSourceCodeRootRepoDir: "your local python script file root repository directory",
    maxHour: 84,
    increment: 6
}

let targetHourStrings: string[] = []
for (let availableHour = 0; availableHour <= envConfig.maxHour; availableHour += envConfig.increment) {
    targetHourStrings.push(availableHour.toString().padStart(3, "0"));
}

envConfig.targetHourStrings = targetHourStrings


export { envConfig }