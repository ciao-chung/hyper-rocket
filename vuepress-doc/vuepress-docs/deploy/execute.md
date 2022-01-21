# 執行佈署(deploy:execute)

## 選項

- config: deploy config檔案絕對路徑
- dump: Dump佈署設定檔(不執行任何佈署動作)
- dumpEnv: Dump出所有的Deploy相關環境變數(不執行任何佈署動作)
- migrate: Publish完成後自動執行Laravel Migrate(僅Laravel佈署才有效)
- workdir: 工作目錄資料夾位置
- workdirName: 工作目錄名稱

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
- beforeFetchCommands(optional): Array, 執行的fetch動作前要執行的指令陣列(CommandArray), cwd為dist目錄
- afterFetchHook(optional): String, 完成的fetch動作後的Hook
- afterFetchCommands(optional): Array, 完成的fetch動作後要執行的指令陣列(CommandArray), cwd為dist目錄

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

### rsync(optional)

**一般屬性**

- path: 要rsync到遠端的目錄
- meta: Array, 額外要rsync的檔案或目錄(rsync專案dist目錄之前會先做rsync), 每個陣列item可設定以下屬性
    - path: String, 與佈署設定檔的相對路徑檔案或目錄
    - to: String, 要rsync到遠端的位置
- beforeRsyncServerCommands(optional): Array, 執行的build動作前要執行的遠端指令陣列(RemoteCommandArray), cwd為dist目錄
- afterRsyncServerCommands(optional): Array, 完成的build動作後要執行的遠端指令陣列(RemoteCommandArray), cwd為dist目錄

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

### nuxtPm2Config(optional)

> Nuxt佈署類型專用, 可在設定nuxt.js啟動的pm2 config

**可用屬性**

- configFile(required): String, pm2設定檔樣板路徑(相對前端目錄的路徑)
- remoteConfigFilePath(required): String, 遠端pm2設定檔路徑
- appName(required): String, server pm2 process name(啟動process之前刪除舊的process用)
- variable(optional): Object, pm2 config檔案使用mustache.js的變數, 此屬性為設定檔內變數

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

詳見: <a href="/deploy/execute/commandArray">deploy commandArray說明文件</a>

## Hooks

詳見: <a href="/deploy/execute/hooks">deploy hook說明文件</a>
