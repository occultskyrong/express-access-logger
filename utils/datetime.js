/**
 * Created by zhangrz on 2018/3/3.
 * Copyright© 2015-2020
 * @version 0.0.1 created
 */

/**
 * 时间格式化函数
 * @param {Date}        defaultDate        时间
 * @param {string}      defaultFormat      格式化字符串
 * @return {*}
 */
const datetimeFormat = (defaultDate, defaultFormat = 'yyyy-MM-dd hh:mm:ss.S') => {
    let date = defaultDate;
    let format = defaultFormat;
    if (!(date instanceof Date)) {
        date = new Date();
    }
    const o = {
        'M+': date.getMonth() + 1, // month
        'd+': date.getDate(), // day
        'h+': date.getHours(), // hour
        'm+': date.getMinutes(), // minute
        's+': date.getSeconds(), // second
        'w+': date.getDay(), // week
        'q+': Math.floor((date.getMonth() + 3) / 3), // quarter
        S: date.getMilliseconds(), // millisecond
    };
    if (/(y+)/.test(format)) { // year
        format = format.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length));
    }
    const keys = Object.keys(o);
    for (let i = 0, len = keys.length; i < len; i += 1) {
        const k = keys[i];
        if (new RegExp(`(${k})`).test(format)) {
            format = format.replace(
                RegExp.$1
                , RegExp.$1.length === 1 ? o[k] : (`00${o[k]}`).substr((`${o[k]}`).length),
            );
        }
    }
    return format;
};

/**
 * 计算响应时间
 * @param {Array} startedAt
 * @return {string}
 */
const calcResponseTime = (startedAt) => {
    const diff = process.hrtime(startedAt);
    // 秒和纳秒换算为毫秒,并保留3位小数
    return `${((diff[0] * 1e3) + (diff[1] * 1e-6)).toFixed(3)}ms`;
};

module.exports = {
    datetimeFormat,
    calcResponseTime,
};
