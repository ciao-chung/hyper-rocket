# 執行佈署(deploy:execute)

## 佈署階段

- fetch: 取得原始碼
- build: 建立要發佈的code
- publish: 發佈, 通常為執行rsync
- extra-service: 額外服務, 例如laravel的queue worker設定
- cleanup: 清除佈署指令建立的暫存工作目錄
- ci: 佈署完成或失敗通知, 目前可透過email, slack, line notify做通知

### 跳過指定階段 

透過本指令的選項--skip

可一次跳過多個指定階段

方便測試佈署設定檔的正確性使用

```bash
hyper-rocket deploy:execute -x \
  -c deploy-config.yml \
  --skip fetch \
  --skip ci 
```

## 佈署設定檔

> 可使用hyper-rocket deploy:create-config --help指令來查看如何產生範例設定檔

- type(optional): String, 佈署類型, 以下為可使用類型
  - default: 預設
  - vue
  - laravel
- info(required): Object, 佈署資訊
- source: Object, 原始碼來源物件
- build: Object, build設定
    
### info(佈署資訊)

- label(required): String, 佈署名稱

### source(取得原始碼設定)

- fetchType: String, 取得原始碼方式, 以下為可用方式
- git: String, 透過git
- path: String, 透過指定的絕對路徑取得
- repo(optional): String, fetchType設定為git的時候指定的git repo來源
- revision(optional): String, fetchType設定為git的時候指定的git版本, 可使用commit branch等, 佈署指令將使用git checkout切換版本
- folder(optional): String, 取得專案後的原始碼相對路徑, 預設為專案根目錄: .
- beforeFetchHook(optional): String, 執行的fetch動作前的Hook
- afterFetchHook(optional): String, 完成的fetch動作後的Hook

### build

**一般屬性**

- distDir(optional): String, dist目錄, 也就是準備執行發佈的目錄, 以下為各佈署類型的預設值
  - vue: dist
  - laravel: .(當下目錄)
  - default: .(當下目錄)
- beforeBuildHook(optional): String, 執行的build動作前的Hook
- beforeBuildCommands(optional): Array, 執行的build動作前要執行的指令陣列(CommandArray), cwd為dist目錄
- afterBuildHook(optional): String, 完成的build動作後的Hook
- afterBuildCommands(optional): Array, 完成的build動作後要執行的指令陣列(CommandArray), cwd為dist目錄

**vue佈署類型專用屬性**

- apibase(optional): String, 設定apibase.json
- apibasePath(optional): String, 指定apibase的檔案相對路徑, 預設為src/config/apibase.json
- env(optional): Object, 佈署指令將會把此env物件設定到src/config/env.json, 當前端一些設定需要依照不同佈署設定來調整的時候, env屬性將是一個很好的選擇

### rsync(optional)

**一般屬性**

- path: 要rsync到遠端的目錄
- meta: Array, 額外要rsync的檔案或目錄(rsync專案dist目錄之前會先做rsync), 每個陣列item可設定以下屬性
  - path: String, 與佈署設定檔的相對路徑檔案或目錄
  - to: String, 要rsync到遠端的位置
- beforeRsyncServerCommands(optional): Array, 執行的build動作前要執行的遠端指令陣列(RemoteCommandArray), cwd為dist目錄
- afterRsyncServerCommands(optional): Array, 完成的build動作後要執行的遠端指令陣列(RemoteCommandArray), cwd為dist目錄

**vue佈署類型專用屬性**

- removeRemoteBeforeRsync: Boolean, rsync之前刪除遠端目錄

### servers

> ServerObject陣列, 定義多台Servers資訊

**ServerObject**

可設定為操作本機或是遠端

當local設定為true將設定為本機

- label: String, Server資訊, 用於佈署指令log或notify識別用
- local: Boolean, 是否為本機
- host: String, 遠端主機host
- user: String, 登入遠端主機使用者帳號
- tag(optional): String, server tag, 可用做條件篩選, 例如cron job只佈署在指定tag的server上

### cron(optional)

> 可在rsync後設定cron job 

佈署指令將建立cron job檔案在每一台server的/etc/cron.d/目錄下

**可用屬性**

- enabled(required): Boolean, 是否啟用佈署cron job功能
- name(required): String, cron job檔案名稱
- user(required): String, cron job檔案的owner
- comment(optional): String, cron job檔案上方的註解, 可用來註明此cron job用途
- onServerTag(optional): String, 只將cron job佈署在含有指定tag的server上
- rules(required): Array, cron job規則陣列, 例如: 0 5 * * * /sbin/shutdown -r now

### queue(optional)

> Laravel佈署類型專用, 可在rsync後laravel queue worker

**可用屬性**

- enabled(required): Boolean, 是否啟用Laravel Queue Worker
- workerDir(optional): String, 設定laravel queue worker設定檔目錄名稱, 預設為queue
- workers(required): Array, QueueWorker設定物件陣列

**QueueWorker設定物件**

- name(required): Queue worker名稱, 佈署指令執行pm2 start的process名稱, 需要同worker設定檔內的name欄位
- filename(required): Queue worker設定檔檔名(須包含yml副檔名), 例如queue.yml
- variable(optional): Object, queue worker設定yml允許使用mustache.js的變數, 此屬性為設定檔內變數

**Worker設定檔範例(YAML)**

```yaml
apps:
  - name: laravel-queue
    cwd: /site/backend
    script: artisan
    exec_mode: fork
    interpreter: php
    instances: 1
    args:
      - queue:work
      - --queue=default
      - --tries=5
      - --sleep=5
```


### ci(optional)

> Continue Integration, 在佈署成功/失敗的時候透過通訊軟體或Email通知

**注意**

使用CI功能之前

請先使用"hyper-rocket ci:config"指令建立CI設定檔

CI設定檔將會建立在~/.hyper-rocket/.ci.yml中

**可用屬性**

- enable: Boolean, 是否啟用CI
- slack: Boolean, 是否使用Slack Webhook做CI
- lineNotify: Boolean, 是否使用Line Notify做CI
- mail: Array, 要進行通知的Email Address陣列

## CommandArray、RemoteCommandArray

> 請查看專案目錄內的docs/commands/deploy/commandArray.md說明文件

## Hooks

> 請查看專案目錄內的docs/commands/deploy/hooks.md說明文件
