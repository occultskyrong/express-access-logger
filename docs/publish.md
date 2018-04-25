# `npm`发布说明

## 流程

- 修改`package.json`中`version`
- 创建`git`标签

```git
git tag -a x.x.x -m 'tag message'
```

- 推送标签

```git
git push origin x.x.x
```

- `npm`发布

```npm
npm publish
```

## `Git tag`命令

```shell
# 修改package.json中version

# 列出现有标签
git tag

# 创建一个含附注类型的标签
git tag -a 0.0.1 -m 'tag message'

# 分享标签到远端仓库
git push origin 0.0.1

# 一次推送所有本地新增的标签上去
git push origin --tags

# 删除本地tag
git tag -d 0.0.1

# 删除远程tag
git push origin :0.0.1
```

***
