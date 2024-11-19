const dayjs = require('dayjs');
const { dateConversion } = require('../utils/helper');

test("Date conversion test", () => {
    const date = new Date();
    const result = dateConversion(date);
    console.log(result);
    console.log(dayjs(date).local().format());
    expect(result).toMatch(dayjs(date).local().format()); 
});