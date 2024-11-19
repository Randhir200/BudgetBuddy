const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

exports.dateConversion = (date = new Date()) => {
    let finalDate;
    finalDate = dayjs(date).local().format();
    console.log(date);
    return finalDate;
}
