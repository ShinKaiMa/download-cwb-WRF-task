

function getNearestTimeDir(): string {
    let availableHours = [0,6,12,18];
    let lagHour = 4;
    // get UTC date
    // let presentDate = new Date();
    let presentDate = new Date(2019, 6, 10, 8, 0)
    console.log("presentDate"+presentDate)
    presentDate.setHours(presentDate.getHours() - 8);
    console.log(presentDate)
    // get latest hour of cwb open data grib file
    // lag hour of forcast publish time is needed
    let presentHour = presentDate.getHours();
    // estimate "lastest" probably available grb hour by shift {lagHour}
    // {lagHour}(unit: hour) means the period between forcast start time and forcast publish time
    let latestGRBHour = presentHour - lagHour
    // if latestGRBHour < 0, standardize it to yesterday hour (i.e : -2 o'clock -> 22 o'clock (yesterday))
    console.log("latestGRBHour: " + latestGRBHour)
    if (latestGRBHour < 0) {
        latestGRBHour = 24 + latestGRBHour;
        presentDate.setDate(presentDate.getDate() - 1);
    }
    // start to calculate nearest availble forcast hour
    let largestPeriod: number = Infinity;
    let nearestHour: number = undefined;
    for (let hour of availableHours) {
        console.log(hour)
        if (latestGRBHour - hour < largestPeriod && latestGRBHour - hour >= 0) {
            largestPeriod = latestGRBHour - hour;
            nearestHour = hour;
        } else if (latestGRBHour - hour < 0) {
            break;
        }
    }
    let year = presentDate.getFullYear().toString();
    let month = (presentDate.getMonth() + 1).toString().padStart(2, "0");
    let day = presentDate.getDate().toString().padStart(2, "0")
    let hour = nearestHour.toString().padStart(2, "0")
    let nearestTimePath =  year +'/'+ month +'/'+ day+'/'+ hour;
    return nearestTimePath;
}


console.log(getNearestTimeDir())