/**
 * Created by zhangrz on 2018/4/25.
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

module.exports = getLog4js;
