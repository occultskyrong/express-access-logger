
# 基于`express`的访问日志记录器

## 1.安装
- 安装要求：`NodeJS v8.9.1` 以上
- 安装方式：

```
npm i express-access-logger -S
```

## 2.主要功能
- 基于 `express` 框架
- 基于 `log4js` （按需自行安装）
- 将 `request` 请求内容和 `response` 响应结果合并记录到日志中

## 3.更新历史

|版本|内容|节点|
|:---|:---|:---|
|0.0.5|更新 - 文档说明和实现逻辑|2018年01月31日|
|0.0.6|更新 - 文档说明、默认关闭debug|2018年02月01日|
|0.0.7|新增 - 读取header中自定义key|2018年04月25日|
|0.0.8|新增 - development开发分支，使用issue管理开发进度|2018年04月25日|

## 4.TODO list
- 响应结果的日志记录，使用bind函数实现

## 5.[说明文档](./docs/README.md)

## 6.License

> 无需声明,随意copy或者fork

[MIT LICENSE](./LICENSE.txt)

