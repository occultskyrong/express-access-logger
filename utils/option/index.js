/**
 * Created by zhangrz on 2018/3/3.
 * Copyright© 2015-2020
 * @version 0.0.1 created
 */

const getHeaders = require('./header');
const getLog4js = require('./log4js');

/**
 *
 * 检查并获取配置信息
 * @param {object} option 自定义配置
 * @return {object} 生成的配置信息
 */
const getOption = (option) => {
    const o = {};
    // 全局唯一标记
    if ('uuid' in option) {
        o.uuid = option.uuid;
    } else {
        o.uuid = 'uuid';
    }
    // 日志记录的方式
    if ('logger' in option) {
        let { logger } = option;
        if (logger === 'console') {
            o.log = console.log;
        } else if (typeof logger === 'function') {
            o.log = option.logger;
        } else if (logger === 'log4js') {
            const log4js = getLog4js('log4jsConfig' in option ? option.log4jsConfig : undefined);
            logger = log4js.getLogger('log4jsLogger' in option ? option.log4jsLogger : 'access');
            logger.level = 'info';
            o.log = (...args) => logger.info(JSON.stringify(args[0]));
        }
    } else {
        o.log = console.log; // 默认为控制台输出
    }
    // 获取token
    if ('token' in option) {
        const { token } = option;
        if (token === false) {
            o.token = () => false;
        } else if (typeof token === 'string') {
            o.token = req => req.header(token);
        } else if (token instanceof Function) {
            o.token = req => token(req);
        }
    } else {
        o.token = req => req.header('authorization') || '';
    }
    // 系统标记
    if ('appKey' in option && typeof option.appKey === 'string') {
        o.appKey = option.appKey;
    } else {
        console.warn(new Error('缺少系统标记字段'));
        o.appKey = 'DEFAULT-APP';
    }
    // 是否开启debug模式:直接输出json格式log,默认关闭
    o.debug = 'debug' in option ? !!option.debug : false;
    // 获取头部信息
    o.getHeaders = getHeaders(option.headers);
    return o;
};

module.exports = {
    getOption,
};
