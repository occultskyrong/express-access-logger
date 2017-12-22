
# 基于`express`的访问日志记录器

## 安装

```
npm i express-access-logger -S 
```

## 主要功能
- 基于 `express` 框架
- 默认基于 `log4js` 
- 将 `request` 请求内容和 `response` 响应结果合并记录到日志中

## 用法

根目录下`_test.js`为可运行express服务
		
```
const express = require('express');
const expressAccessLogger = require('./index');
const bodyParser = require('body-parser');
	
const app = express();
	
// for parsing application/json
app.use(bodyParser.json()); 
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true})); 
	
// 使用默认参数加载日志记录器中间件
app.use(expressAccessLogger()); 
```

## 参数

- #### 参数列表

|参数|说明|字段类型|取值|默认值|
|:---|:---|:---|:---|:---|
|`uuid`|唯一标识符,用于全链路追踪|string|-|uuid|
|`logger`|日志记录器,用于日志记录|'string',Function|'console','log4js',function|console.log|
|`log4jsConfig `|log4js配置,logger为log4js时读取此参数|boolean,Object|false,object|false|
|`log4jsLogger`|log4js中logger的name,配置log4jsConfig时必须传入此参数|string|-|access|
|`token `|token的的取值,从header中读取|Function,string,boolean|function,'authorization',false|authorization|
|`appKey`|系统标识符|string|-|DEFAULT-APP|
|`debug`|开启debug模式:直接输出json格式log|boolean|-|true|

- #### 栗子：

	- `log4jsConfig`
	
		缺省值，log4js的配置
		
		```
		{
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
    	}
		```
	- `token`
	
	  	function(req) 回调函数的参数为req，例如(req)=>req.header('authorization')|
	  

## 结果说明

- remoteIP
 	
 	```
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
 	```
 	
- json格式

	```
	{ 
	  uuid: '1-23-4',
	  remoteIP: '127.0.0.1',
	  originalUrl: '/test/1?a=1',
	  appKey: 'AC-B-D',
	  req: 
	   { method: 'POST',
	     header: { 'Content-Type': 'application/x-www-form-urlencoded' },
	     query: { a: '1' },
	     body: { bb: '2' },
	     requestAt: '2017-12-21 19:03:00' },
	  res: 
	   { status: 200,
	     responseTime: '1259.850ms',
	     responseAt: '2017-12-21 19:03:01' },
	  token: '12321321312321321' 
	}
	``` 
- 日志：
 
 	```
 	[2017-12-21T19:03:01.261] [INFO] access - {"uuid":"1-23-4","remoteIP":"127.0.0.1","originalUrl":"/test/1?a=1","appKey":"AC-B-D","req":{"method":"POST","header":{"Content-Type":"application/x-www-form-urlencoded"},"query":{"a":"1"},"body":{"bb":"2"},"requestAt":"2017-12-21 19:03:00"},"res":{"status":200,"responseTime":"1259.850ms","responseAt":"2017-12-21 19:03:01"},"token":"12321321312321321"}
 	```
 	
## `npm`发布流程
- Git tag

```
## 列出现有标签
	git tag
## 创建一个含附注类型的标签
	git tag -a 0.0.1 -m 'tag message'
## 分享标签到远端仓库
	git push origin 0.0.1
## 一次推送所有本地新增的标签上去
	git push origin --tags
## 删除本地tag
	git tag -d 0.0.1
## 删除远程tag
	git push origin :0.0.1
```

- 修改`package.json`中`version`

- npm publish

```
npm publish
```

 	
## [MIT LICENSE](./LICENSE.txt)
> 无需声明,随意copy或者fork
