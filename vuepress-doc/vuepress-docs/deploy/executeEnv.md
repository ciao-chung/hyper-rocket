# 佈署環境變數(DEPLOY_ENV)說明

## DIST_PATH

PRODUCTION目錄

準備做rsync用

`app/src/modules/deploy/publishHandler/_basePublishHandler.js`的rsync操作

`from: DEPLOY_ENV.DIST_PATH`中有使用到

將在buildHandler中的`setupDistPath` method中依照各自類型定義
