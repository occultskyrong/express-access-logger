/**
 * Created by zhangrz on 2017/12/15.
 * Copyright© 2015-2020 occultskyrong (https://github.com/occultskyrong)
 * @version 0.0.1 created
 */

/*
 * 参考文档
 * http://nodejs.cn/api/process.html#process_process_hrtime_time
 * https://github.com/expressjs/body-parser#bodyparserjsonoptions
 * http://expressjs.com/en/4x/api.html#req.body
 */

const {
    getOption,
    calcResponseTime,
    datetimeFormat,
    getIP,
} = require('./utils');

/**
 * 绑定到express的日志文件中间件
 * @param {Object}                  [defaultOption]                     配置信息
 * @param {String}                  [defaultOption.uuid]                唯一标识符,用于全链路追踪
 * @param {String|Function}         [defaultOption.logger]              日志记录器
 * @param {Boolean|Object}          [defaultOption.log4jsConfig]        log4js配置
 * @param {String}                  [defaultOption.log4jsLogger]        log4js中logger的name
 * @param {Function|String|Boolean} [defaultOption.token]               token的的取值key
 * @param {String}                  [defaultOption.appKey]              系统标识符
 * @param {Boolean}                 [defaultOption.debug]               是否开启debug模式,默认关闭
 * @return {function(Object, Object, Function)}                         标准请求-响应拦截结构
 */
module.exports = (defaultOption = {}) => {
    let option = defaultOption;
    option = getOption(option); // 获取配置信息
    const TIME_FORMAT = 'yyyy-MM-dd hh:mm:ss.S';
    let log = {};
    return (req, res, next) => {
        const startedAt = process.hrtime(); // 获取高精度时间
        /**
         * 响应回调
         * https://stackoverflow.com/questions/32973307/express-response-payload-on-response-finish
         */
        const responseCallback = () => {
            const {
                statusCode,
            } = res;
            log.res = Object.assign(log.res, {
                statusCode,
                responseTime: calcResponseTime(startedAt),
                responseAt: datetimeFormat(new Date(), TIME_FORMAT),
            });
            if (option.debug) {
                console.log(log);
            }
            option.log(log);
        };
        log = {
            uuid: req.header(option.uuid) || '',
            remoteIP: getIP(req),
            originalUrl: req.originalUrl,
            appKey: option.appKey,
            req: {
                method: req.method,
                header: {
                    'User-Agent': req.header('User-Agent') || '',
                    'Content-Type': req.header('Content-Type') || '',
                },
                query: req.query,
                body: req.body,
                requestAt: datetimeFormat(new Date(), TIME_FORMAT),
            },
            res: {},
        };
        if (option.token) {
            log.token = option.token(req);
        }

        // TODO 配置：是否使用重定向数据，使用哪些重定向，拆分此方法到response.js中，可插拔
        const old = res.json.bind(res);
        res.json = (body) => {
            console.info(33333);
            log.res.body = body;
            old(body);
        };

        // 有响应的返回
        res.once('finish', responseCallback);

        // 无响应超时的返回
        res.once('close', responseCallback);

        next();
    };
};
