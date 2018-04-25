/**
 * Created by zhangrz on 2018/4/25.
 * Copyright© 2015-2020
 * @version 0.0.1 created
 */

const defaultHeaders = ['User-Agent', 'Content-Type'];

/**
 *
 * 获取头部信息
 * @param headers 需要获取header的key数组
 * @return {function(*)}
 */
const getHeaders = (headers = []) => {
    const headersArray = defaultHeaders.concat(headers);
    return (req) => {
        const result = {};
        headersArray.forEach((headerKey) => {
            result[headerKey] = req.header(headerKey) || '';
        });
        return result;
    };
};

module.exports = getHeaders;
