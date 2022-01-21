# hyper-rocket

> 個人專屬工具, 因為太多指令懶得記而打造的CLI Tool

<img
:src="$withBase('/demo.gif')"
style="width: 100%">

## 主要用途

- 工作環境建置
- production環境佈署
- 簡易使用rsync功能
- 簡易操作mysql服務
- 快速設定vue/laravel的nginx config
- 快速設定php-fpm

## 環境需求

Node.js 10 up (可以直接執行專案內的meta/nodejs.sh來安裝)

## Node.js安裝

```bash
# node.js 10
curl -sL https://raw.githubusercontent.com/ciao-chung/hyper-rocket/master/meta/nodejs.sh | sudo -E bash

# node.js 12
curl -sL https://raw.githubusercontent.com/ciao-chung/hyper-rocket/master/meta/nodejs-12.sh | sudo -E bash
```

## 安裝

```bash
yarn global add hyper-rocket
```

## 版本

- 1.x: 整理主要功能中

## 指令說明

大部分指令都很簡單

基本上只要使用--help查看資訊即可

較複雜的指令請查看文件
