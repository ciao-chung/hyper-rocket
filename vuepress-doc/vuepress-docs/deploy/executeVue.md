# Vue Site佈署

## 可用屬性

- apibase(optional): String, 設定apibase.json
- apibasePath(optional): String, 指定apibase的檔案相對路徑, 預設為src/config/apibase.json
- env(optional): Object, 佈署指令將會把此env物件設定到src/config/env.json, 當前端一些設定需要依照不同佈署設定來調整的時候, env屬性將是一個很好的選擇
- vuePublicFolderPath(optional): String, vue專案的public目錄(root)名稱, 使用預設為`public`

## rsync屬性額外子屬性

- removeRemoteBeforeRsync: Boolean, rsync之前刪除遠端目錄

## deploy(Single Server)

> 若不使用SSL, 可不使用`ssl`及`email`參數

```bash
hyper-rocket nginx:site \
    --ssl \     
    --spa \     
    --filename [domain].conf \
    --path /home/site/project/[project-name]/frontend \
    --domain [domain] \
    --email [email]
```

## deploy(Multi Server)

> 若為Load Balancer架構可使用此方式佈署

port為`內部使用的port`

```bash
hyper-rocket nginx:localhost \
    --spa \     
    --filename [domain].conf \
    --path /home/site/project/[project-name]/frontend \
    --port 9000
```
