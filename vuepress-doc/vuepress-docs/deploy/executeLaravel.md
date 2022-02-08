# Laravel佈署

## 可用屬性

- queue: laravel queue設定, 詳見下述`queue`段落

## queue(optional)

> Laravel佈署類型專用, 可在rsync後laravel queue worker

**可用屬性**

- enabled(required): Boolean, 是否啟用Laravel Queue Worker
- workerDir(optional): String, 設定laravel queue worker設定檔目錄名稱, 預設為queue
- workers(optional): Array, QueueWorker設定物件陣列
- build
  - env(optional): Object, 覆蓋.env.example的設定(透過`php artisan env:set`)
  - envFilePath(optional): Laravel .env設定檔案位置, 若使用此設定上述`env`屬性將無效

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

## deploy(Single Server)

> 若不使用SSL, 可不使用`ssl`及`email`參數

```bash
hyper-rocket nginx:site \
    --ssl \ 
    --filename [domain].conf \
    --path /home/site/project/[project-name]/backend/public \
    --domain [domain] \
    --email [email]
```

## deploy(Multi Server)

> 若為Load Balancer架構可使用此方式佈署

port為`內部使用的port`

```bash
hyper-rocket nginx:site \
    --filename [domain].conf \
    --path /home/site/project/[project-name]/backend/public \
    --domain [domain] \
    --port 8080
```
