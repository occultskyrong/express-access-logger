/**
 * Created by zhangrz on 2017/12/15.
 * Copyright© 2015-2020 occultskyrong (https://github.com/occultskyrong)
 * @version 0.0.1 created
 */

'use strict';

/*
 * 参考文档
 * http://nodejs.cn/api/process.html#process_process_hrtime_time
 * https://github.com/expressjs/body-parser#bodyparserjsonoptions
 * http://expressjs.com/en/4x/api.html#req.body
 */

Date.prototype.format = DateForm; // Date原型链绑定时间格式化函数

/**
 * 绑定到express的日志文件中间件
 * @param {Object}                  [option] 配置信息
 * @param {String}                  [option.uuid] 唯一标识符,用于全链路追踪
 * @param {String|Function}         [option.logger] 日志记录器
 * @param {Boolean|Object}          [option.log4jsConfig] log4js配置
 * @param {String}                  [option.log4jsLogger] log4js中logger的name
 * @param {Function|String|Boolean} [option.token] token的的取值key
 * @param {String}                  [option.appKey] 系统标识符
 * @param {Boolean}                 [option.debug] 开启debug模式
 * @return {function(Object, Object, Function)} 标准请求-响应拦截结构
 */
module.exports = (option = {})=> {
    option = getOption(option); // 获取配置信息
    const TIME_FORMAT = 'yyyy-MM-dd hh:mm:ss.S';
    let log = {};
    return (req, res, next)=> {
        const startedAt = process.hrtime(); // 获取高精度时间
        log = {
            uuid: req.header(option.uuid),
            remoteIP: getIP(req),
            originalUrl: req.originalUrl,
            appKey: option.appKey,
            req: {
                method: req.method,
                header: {
                    'Content-Type': req.header('Content-Type'),
                },
                query: req.query,
                body: req.body,
                requestAt: new Date().format(TIME_FORMAT),
            },
            res: {},
        };
        if (option.token) {
            log.token = option.token(req);
        }

        // 有响应的返回
        res.once('finish', responseCallback);

        // 无响应超时的返回
        res.once('close', responseCallback);

        next();

        /**
         * 响应回调
         */
        function responseCallback() {
            log.res = {
                status: res.statusCode,
                responseTime: calcResponseTime(startedAt),
                responseAt: new Date().format(TIME_FORMAT),
            };
            if (option.debug) {
                console.log(log);
            }
            option.log(log);
        }
    };
};

// ———————— 调用函数置于底部,便于查看主要逻辑 ————————

/**
 * 检查并获取配置信息
 * @param {object} option 自定义配置
 * @return {object} 生成的配置信息
 */
function getOption(option) {
    let o = {};
    // 全局唯一标记
    if ('uuid' in option) {
        o.uuid = option.uuid;
    } else {
        o.uuid = 'uuid';
    }
    // 日志记录的方式
    if ('logger' in option) {
        const logger = option.logger;
        if (logger === 'console') {
            o.log = console.log;
        } else if (typeof logger === 'function') {
            o.log = option.logger;
        } else if (logger === 'log4js') {
            const log4js = getLog4js('log4jsConfig' in option ? option.log4jsConfig : undefined);
            const logger = log4js.getLogger('log4jsLogger' in option ? option.log4jsLogger : 'access');
            logger.level = 'info';
            o.log = (...args)=>logger.info(JSON.stringify(args[0]));
        }
    } else {
        o.log = console.log; // 默认为控制台输出
    }
    // 获取token
    if ('token' in option) {
        const token = option.token;
        if (token === false) {
            o.token = (req)=>false;
        } else if (typeof token === 'string') {
            o.token = (req)=>req.header(token);
        } else if (token instanceof Function) {
            o.token = (req)=>token(req);
        }
    } else {
        o.token = (req)=>req.header('authorization');
    }
    // 系统标记
    if ('appKey' in option && typeof option.appKey === 'string') {
        o.appKey = option.appKey;
    } else {
        console.error(new Error('缺少系统标记字段'));
        o.appKey = 'DEFAULT-APP';
    }
    // 是否开启debug模式:直接输出json格式log
    o.debug = 'debug' in option ? !!option.debug : true;
    return o;
}

/**
 * 生成log4js实例
 * @param {object} config
 * @return {log4js}
 */
function getLog4js(config) {
    const __ = require('log4js');
    __.configure(getLog4jsConfig(config));
    return __;
}

/**
 * 获取log4js默认配置
 * @param {object} [config]
 * @param {Object} [config.log4jsConfig.appenders]
 * @param {Object} [config.log4jsConfig.categories]
 * @param {Object} [config.log4jsConfig.categories.default]
 * @return {*}
 */
function getLog4jsConfig(config) {
    const defaultConfig = {
        appenders: {
            out: { // console-log
                type: 'stdout',
            }, access: { // access-log
                type: 'dateFile',
                filename: './logs/access/access.log', // 基于调用者地址的同级logs文件夹
                pattern: '.yyyy-MM-dd', // 日志名格式
                daysToKeep: '30', // 最长留存30天日志
                keepFileExt: true, // 保证.log扩展名,即access.2017-09-21.log
            },
        }, categories: {
            default: { // 解析器可能变更名称,直接使用default
                appenders: ['access', 'out'],
                level: 'info',
            },
        },
    };
    if (config) {
        if (typeof config === 'object' && Object.keys(config).length > 0) {
            return config;
        } else {
            console.error(new Error('log4jsConfig must be an object !'));
            return defaultConfig;
        }
    } else {
        // log4js默认配置
        return defaultConfig;
    }
}

/**
 * nginx转发后获取实际IP信息
 * @param {object} req 请求参数
 * @return {string}
 */
function getIP(req) {
    let ip = req.get('x-forwarded-for'); // 获取代理前的ip地址
    if (ip && ip.split(',').length > 0) {
        ip = ip.split(',')[0];
    } else {
        ip = req.connection.remoteAddress;
    }
    const ipArr = ip.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g);
    return ipArr && ipArr.length > 0 ? ipArr[0] : '127.0.0.1';
}

/**
 * Date绑定时间格式化函数
 * @param {string} format
 * @return {*}
 */
function DateForm(format) {
    let o = {
        'M+': this.getMonth() + 1, // month
        'd+': this.getDate(), // day
        'h+': this.getHours(), // hour
        'm+': this.getMinutes(), // minute
        's+': this.getSeconds(), // second
        'w+': this.getDay(), // week
        'q+': Math.floor((this.getMonth() + 3) / 3), // quarter
        'S': this.getMilliseconds(), // millisecond
    };
    if (/(y+)/.test(format)) {// year
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(RegExp.$1
                , RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
        }
    }
    return format;
}

/**
 * 计算响应时间
 * @param {Array} startedAt
 * @return {string}
 */
function calcResponseTime(startedAt) {
    const diff = process.hrtime(startedAt);
    // 秒和纳秒换算为毫秒,并保留3位小数
    return `${(diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3)}ms`;
}
