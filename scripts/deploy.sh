#!/usr/bin/env sh
 
# 当发生错误时中止脚本
set -e

# 部署到自定义域域名
# echo 'www.example.com' > CNAME

git config user.email "18810986017@163.com"
git config user.name "xuxia1009"
git remote set-url origin https://gitlab.com/xuxia1009/node-grab.git

git fetch origin
git checkout master

# 安装依赖
npm install

# 构建
npm run start

git add -A
git commit -m "Add:docs"

cat .git/config

# 部署到 https://<USERNAME>.github.io
git push origin master:master

# 部署到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages
