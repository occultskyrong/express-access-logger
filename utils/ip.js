/**
 * Created by zhangrz on 2018/3/3.
 * Copyright© 2015-2020
 * @version 0.0.1 created
 */

/**
 *
 * nginx转发后获取实际IP信息
 * @param {object} req 请求参数
 * @return {string}
 */
const getIP = (req) => {
    let ip = req.get('x-forwarded-for'); // 获取代理前的ip地址
    if (ip && ip.split(',').length > 0) {
        const ipArr = ip.split(',');
        if (ipArr.length > 0) {
            [ip] = ipArr;
        } else {
            ip = '0.0.0.0';
        }
    } else {
        ip = req.connection.remoteAddress;
    }
    if (!ip) { // 无法获取到IP信息
        return '0.0.0.0';
    }
    const ipArr = ip.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g);
    return ipArr && ipArr.length > 0 ? ipArr[0] : '127.0.0.1';
};

module.exports = {
    getIP,
};
