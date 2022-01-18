const {Command, flags} = require('@oclif/command')
const cli = require('cli-ux')
const { env } = require('shelljs')
const { resolve } = require('path')
const { readdirSync, writeFileSync } = require('fs')
class dbDump extends Command {
  async run() {
    const {args, flags} = this.parse(dbDump)
    this.flags = flags
    this.username = flags.username
    this.password = flags.password
    this.outputPath = flags.output
    this.db = flags.db
    this.password = flags.password
    if(!this.password) {
      this.password = await cli.ux.prompt('Root password?', {
        type: 'hide',
      })
    }
    this.maxFileQuantity = flags.max

    this.subFolderName = now('YYYYMMDD_HHmmss')
    this.folderPath = resolve(this.outputPath, this.subFolderName)

    this.initLog()
    await execAsync(`mkdir -p ${this.folderPath}`)
    await this.dumpDatabases()
    await this.removeOverLimitFiles()
    await this.outputLog()
    await this.backupToS3()
    await this.backupToGit()
  }

  initLog() {
    this.backupLog = `
# hyper-rocket資料庫備份

> ${now()}

- 目錄: ${this.folderPath}
- 備份紀錄最多保留數量: ${this.maxFileQuantity}
- 預計備份資料庫: ${this.db.toString()}
- 備份帳號: ${this.username}

`
  }

  addLog(text) {
    this.backupLog = `${this.backupLog}\n\n${text}`
  }

  async dumpDatabases() {
    this.addLog(`## 開始匯出資料庫(mysqldump)`)
    for(const db of this.db) {
      await this.dumpDatabaseItem(db)
    }
    this.addLog(`資料庫全數匯出完成`)
    this.addLog(`<hr>`)
  }

  async dumpDatabaseItem(dbName) {
    const filePath = `${this.subFolderName}/${dbName}.sql`
    try {
      await execAsync(`mysqldump -u ${this.username} -p${this.password} ${dbName} > ${filePath}`, {
        cwd: this.outputPath,
      })
      logger(`${dbName}匯出完成`, 'yellow')
      this.addLog(`${dbName}匯出完成`)
    } catch (error) {
      // 刪除匯出失敗sql檔案
      await execAsync(`rm ${filePath}`, { cwd: this.outputPath })
      logger(`${dbName}匯出失敗`, 'yellow')
      this.addLog(`${dbName}匯出失敗`)
      logger(error, 'yellow')
    }
  }

  // 移除較久的檔案
  async removeOverLimitFiles() {
    const files = readdirSync(this.outputPath)
      .filter(file => file != '.git')
      .reverse()
    logger(`正在移除過久的備份(保留最新${this.maxFileQuantity}次備份)`)

    // 沒超過檔案限制
    if(files.length < this.maxFileQuantity) return

    this.addLog(`## 開始移除過久的備份`)
    for(const index in files) {
      const file = files[index]
      const fileIndex = parseInt(index)+1
      if(fileIndex <= this.maxFileQuantity) continue
      const folderFullPath = resolve(this.outputPath, file)
      logger(`正在刪除過期備份: ${file}`, 'yellow')
      this.addLog(`## 開始移除過久的備份`)
      await execAsync(`rm -r ${folderFullPath}`, { cwd: this.outputPath })
    }
  }

  async outputLog() {
    logger(`正在產生Log`, 'yellow')
    const readmePath = resolve(this.outputPath, 'README.md')
    await writeFileSync(readmePath, this.backupLog, 'utf-8')
  }

  async backupToS3() {
    this.s3Arn = this.flags.s3
    if(!this.s3Arn) return
    logger(`即將備份至S3`, 'yellow')
    await execAsync(`aws s3 sync ${this.outputPath} ${this.s3Arn} --exclude ".git/*" --delete`)
  }

  async backupToGit() {
    this.git = this.flags.git
    if(!this.git) return
    logger(`即將備份至Git Repository`, 'yellow')
    await execAsync(`rm -rf .git; git init`, {
      cwd: this.outputPath,
      ignoreError: true,
    })

    await execAsync(`git remote add origin ${this.git}`, {
      cwd: this.outputPath,
      ignoreError: true,
    })

    await execAsync(`git add .; git commit -am "backup ${now()} (${this.db.toString()})"`, {
      cwd: this.outputPath,
      ignoreError: true,
    })

    await execAsync(`git push -u origin master --force`, {
      cwd: this.outputPath,
      ignoreError: true,
    })
  }
}

dbDump.description = `
匯出資料庫`

dbDump.flags = {
  db: flags.string({
    multiple: true,
    required: true,
    description: `要匯出的資料庫名稱(可多個)`,
  }),
  max: flags.integer({
    default: 7,
    description: `最多檔案數量`,
  }),
  output: flags.string({
    char: 'o',
    required: true,
    description: `輸出路徑`,
  }),
  username: flags.string({
    char: 'u',
    required: true,
    description: `MySQL帳號`,
  }),
  password: flags.string({
    char: 'p',
    description: `MySQL密碼
使用此參數將不會出現互動式密碼問答`,
  }),
  s3: flags.string({
    description: `S3 bucket ARN(S3備份機制)
請先確保有安裝${chalk.hex(COLOR.ORANGE_HEX)('AWS CLI')}
並有該bucket足夠的寫入權限
此選項將使用${chalk.hex(COLOR.ORANGE_HEX)('aws s3 sync')}指令將備份目錄存放到S3中

若要存在bucket的第一層
請使用該bucket ARN
例如: ${chalk.hex(COLOR.ORANGE_HEX)('s3://your-bucket-name')}

若要存在bucket中的某目錄(例如foobar)
請使用該目錄完整ARN路徑
例如: ${chalk.hex(COLOR.ORANGE_HEX)('s3://your-bucket-name/foobar')}
`,
  }),
  git: flags.string({
    description: `Git Repository(GIT備份機制)
此選項將使用${chalk.hex(COLOR.ORANGE_HEX)('git')}來做備份`,
  }),
}

module.exports = dbDump
