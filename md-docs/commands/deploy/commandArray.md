# 設定檔 - 指令陣列/遠端指令陣列

## CommandArray

> 指令陣列

### 字串類型指令(CommandItem)

**範例**
```yaml
commands:
  - cd frontend
  - yarn install
  - yarn build 
```

### 物件類型指令(CommandItem)

可使用三種屬性

- script(required): String, 要執行的指令
- ignoreError(optional): Boolean, 當指令遇到error是否忽略(若沒進行忽略, 如果發生錯誤佈署指令將會中斷)
- quite(optional): Boolean, 是否不在console中顯示執行的指令, 設定為true後將不顯示

**範例**
```yaml
commands:
  - script: cd frontend
    ignoreError: true
    quite: true
  - script: yarn install
    ignoreError: true
  - script: yarn build
    ignoreError: true
```

## RemoteCommandArray

> 遠端指令陣列

### 遠端指令物件(RemoteCommandObject)

物件類型指令(CommandItem)的屬性皆可使用

可選擇操作本機或是遠端

當local設定為true將設定為本機

- local: Boolean, 是否為本機
- host: String, 遠端主機host
- user: String, 登入遠端主機使用者帳號
- remoteCwd(optional): String, 遠端指令的執行CWD目錄
