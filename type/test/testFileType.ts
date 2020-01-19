let { promisify } = require('util');
let sizeOf = promisify(require('image-size'));

const test = async() => {
    try{
        const dimensions = await sizeOf('D:\\CWB-WRF-3KM-Result\\20200103\\06\\East_Asia\\Precipitation\\{Type_850hPa_Wind_and_Precip}CWB_WRF_3km_NTW_850_Wind_6HPrecip_Init_2020130600_FcstH_018.png');
        console.log(dimensions);
    } catch(err){
        console.log(err)
    }

}


test();