/**
 * Created by zhangrz on 2018/3/3.
 * Copyright© 2015-2020
 * @version 0.0.1 created
 */

/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
const Log4JS = require('log4js');

/**
 * 获取log4js默认配置
 * @param {object} [config]
 * @param {Object} [config.log4jsConfig.appenders]
 * @param {Object} [config.log4jsConfig.categories]
 * @param {Object} [config.log4jsConfig.categories.default]
 * @return {*}
 */
const getLog4jsConfig = (config) => {
    const defaultConfig = {
        appenders: {
            out: { // console-log
                type: 'stdout',
            },
            access: { // access-log
                type: 'dateFile',
                filename: './logs/access/access.log', // 基于调用者地址的同级logs文件夹
                pattern: '.yyyy-MM-dd', // 日志名格式
                daysToKeep: '30', // 最长留存30天日志
                keepFileExt: true, // 保证.log扩展名,即access.2017-09-21.log
            },
        },
        categories: {
            default: { // 解析器可能变更名称,直接使用default
                appenders: ['access', 'out'],
                level: 'info',
            },
        },
    };
    if (config) {
        if (typeof config === 'object' && Object.keys(config).length > 0) {
            return config;
        }
        console.error(new Error('log4jsConfig must be an object !'));
    }
    // log4js默认配置
    return defaultConfig;
};

/**
 * 生成log4js实例
 * @param {object} config
 * @return {object}
 */
const getLog4js = (config) => {
    Log4JS.configure(getLog4jsConfig(config));
    return Log4JS;
};

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
        o.token = req => req.header('authorization');
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
    return o;
};

module.exports = {
    getOption,
};
