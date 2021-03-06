/**
 * Created by zhangrz on 2017/12/15.
 * Copyright© 2015-2020 occultskyrong (https://github.com/occultskyrong)
 * @version 0.0.1 created
 */


// TODO 先安装express
const express = require('express');
const expressAccessLogger = require('../index');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// —————列出现有标签——— 加入中间件 ——————————
app.use(expressAccessLogger({
    logger: 'log4js', // 建议配置
    appKey: 'eal-test', // 最低配置
    debug: true,
    headers: ['x-test-key', 'Content-Length'],
}));

app.get('/test/:id', (req, res) => {
    console.info(
        '————————',
        'originalUrl:', req.originalUrl,
        'query:', req.query,
        'body:', req.body,
        'params:',
        req.params,
    );
    setTimeout(() => {
        res.json({
            a: 1,
            b: 2,
            c: true,
            d: { e: 5 },
        });
    }, 1251);
});

app.listen(3000, () => {
    console.info('------- 启动服务 -------');
    console.info('----- 请求:http://localhost:3000 查看后端日志');
});


/*
 * 测试说明
 * 浏览器中访问 POST localhost:3000/test/123?a=1 body={b:2}
 */
