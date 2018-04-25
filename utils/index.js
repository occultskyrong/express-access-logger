/**
 * Created by zhangrz on 2018/3/3.
 * Copyright© 2015-2020 occultskyrong (https://github.com/occultskyrong)
 * @version 0.0.1 created
 */

const { getOption } = require('./option');
const { datetimeFormat, calcResponseTime } = require('./datetime');
const { getIP } = require('./ip');

module.exports = {
    getOption,
    datetimeFormat,
    calcResponseTime,
    getIP,
};
