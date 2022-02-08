# Nuxt Site佈署

## 可用屬性

- env(optional): Object, 佈署指令將會把此env物件設定到src/config/env.json, 當前端一些設定需要依照不同佈署設定來調整的時候, env屬性將是一個很好的選擇
- vuePublicFolderPath(optional): String, nuxt專案的public目錄(root)名稱, 使用預設為`static`
- build:
  - clientBuildScript(optional): 當`nuxt.target`設定為`static`時有作用, client端的打包指令, 預設為`yarn generate`
  - serverBuildScript(optional): 當`nuxt.target`設定為`server`時有作用, server端的打包指令, 預設為`yarn build`
- nuxt(required): Object, nuxt專用設定, 詳見下方`nuxt設定`段落

## nuxt設定

- target(required): `nuxt target`, 可用值為`server`或`static` 
- pm2AppName(optional): `nuxt target`為`server`時, 需要透過`pm2`啟動`nuxt`, 這個設定為該`pm2`的`process name`, 預設為`nuxt-site`
- port(optional): `nuxt start`啟動的`port`, 預設為`8888`
- buildAtClient(optional): 在client端打包前端, 優點是可以將打包的負載轉嫁到執行發佈client端, 缺點是`rsync`的檔案數量非常多

## rsync屬性額外子屬性

- removeRemoteBeforeRsync: Boolean, rsync之前刪除遠端目錄

## deploy(Single Server)

> 若不使用SSL, 可不使用`ssl`及`email`參數

**參數**

- port(required): String, 內部Proxy Port
- proxyPort: String, 要轉接的外部Port(預設為80)
- domain(required): String, 網域, 如果是本機請使用localhost
- ssl: Boolean, 使用SSL
- email: String, Let's encrypt email
- filename(required): String, 存在/etc/nginx/sites-available/中的檔名, 例如: site.conf

```bash
hyper-rocket nginx:nuxt \
    --ssl \     
    --spa \     
    --filename [domain].conf \
    --path /home/site/project/[project-name]/frontend \
    --domain [domain] \
    --email [email]
```

## deploy(Multi Server)

基本上同`Single Server`佈署方式

只要將`host`改為`localhost`

並不要使用`ssl`及`email`選項即可

```bash
hyper-rocket nginx:nuxt \
    --ssl \     
    --spa \     
    --filename [domain].conf \
    --path /home/site/project/[project-name]/frontend \
    --domain [domain] \
    --email [email]
```
