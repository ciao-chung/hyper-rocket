# Hooks

指定佈署設定YAML檔案的相對路徑js檔

並在該js中使用module.export回傳一個async callback

讓佈署指令可在指定階段自動調用該callback

## Hook範例

```javascript
module.exports = async () => {
  console.warn(global.DEPLOY_ENV)
  console.warn('before build...')
}
```

## Hook中可使用的global變數、物件、method
