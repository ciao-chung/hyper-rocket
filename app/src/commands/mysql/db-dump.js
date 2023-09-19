const {Command, flags} = require('@oclif/command')
const cli = require('cli-ux')
const { env } = require('shelljs')
const { resolve } = require('path')
const { readdirSync, writeFileSync } = require('fs')
const lineNotifyService = require('@services/lineNotifyService.js')
const slackWebHookService = require('@services/slackWebHookService.js')
const mailService = require('@services/mailService.js')
const moment = require("moment");
class dbDump extends Command {
  async run() {
    const {args, flags} = this.parse(dbDump)
    this.flags = flags
    this.username = flags.username
    this.password = flags.password
    this.host = flags.host
    this.outputPath = flags.output
    this.db = flags.db
    this.password = flags.password
    if(!this.password) {
      this.password = await cli.ux.prompt('Root password?', {
        type: 'hide',
      })
    }
    this.maxFileQuantity = flags.max

    this.subFolderName = `hyper-rocket-dump-${now('YYYYMMDD_HHmmss')}`
    this.folderPath = resolve(this.outputPath, this.subFolderName)

    this.initLog()
    await execAsync(`mkdir -p ${this.folderPath}`)
    await this.dumpDatabases()
    await this.removeOverLimitFiles()
    await this.outputLog()
    await this.backupToS3()
    await this.backupToGit()
    await this.ci()
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
    const sslCa = this.flags['ssl-ca']
    const sslCert = this.flags['ssl-cert']
    const sslKey = this.flags['ssl-key']
    const sslCaOptions = sslCa ? `--ssl-ca ${sslCa}` : ''
    const sslCertOptions = sslCert ? `--ssl-cert ${sslCert}` : ''
    const sslKeyOptions = sslKey ? `--ssl-key ${sslKey}` : ''
    const sslOptions = `${sslCaOptions} ${sslCertOptions} ${sslKeyOptions}`
    try {
      await execAsync(`mysqldump -u ${this.username} -h ${this.host} -p${this.password} ${sslOptions} ${dbName} > ${filePath}`, {
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
      .filter(file => {
        if(file == '.git') return false
        if(new RegExp(/hyper-rocket-dump/g).test(file) == false) return false
        return true
      })
      .reverse()
    logger(`正在移除過久的備份(保留最新${this.maxFileQuantity}次備份)`)

    // 沒超過檔案限制
    if(files.length < this.maxFileQuantity) return
    this.addLog(`## 開始移除過久的備份`)
    for(const index in files) {
      const file = files[index]
      const fileIndex = parseInt(index)+1
      if(fileIndex <= this.maxFileQuantity) continue
      const isDateFolderName = new RegExp(/hyper-rocket-dump/g).test(file) // 僅刪除日期目錄, 避免誤刪其他檔案
      if(!isDateFolderName) continue
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

  async ci() {
    if(this.flags['ci-line']) {
      lineNotifyService.init()
      lineNotifyService.send(`🚀 HYPER ROCKET資料庫備份完成通知\n${this.backupLog}`)
    }

    if(this.flags['ci-slack']) {
      slackWebHookService.init()
      slackWebHookService.send({
        text: `🚀 HYPER ROCKET測試通知`,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*🚀 HYPER ROCKET資料庫備份完成通知*`,
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `${this.backupLog}`,
            },
          },
        ],
      })
    }

    if(this.flags['ci-email']) {
      mailService.init()
      mailService.send({
        subject: `🚀 HYPER ROCKET資料庫備份完成通知 ${now()}`,
        targets: this.flags['ci-email'],
        text: `${this.backupLog}`,
      })
    }
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
    description: `輸出路徑
${chalk.hex(COLOR.RED_HEX)('請注意這個輸入路徑將會清除過多的備份')}
${chalk.hex(COLOR.RED_HEX)('此目錄路徑請使用請獨立建立一個目錄')}
${chalk.hex(COLOR.RED_HEX)('避免資料被誤刪')}`,
  }),
  host: flags.string({
    char: 'h',
    default: 'localhost',
    description: `MySQL Host`,
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
  'ci-line': flags.boolean({
    description: `備份完成後發通知${chalk.hex(COLOR.ORANGE_HEX)('line-notify')}`,
  }),
  'ci-email': flags.string({
    multiple: true,
    description: `備份完成後發通知${chalk.hex(COLOR.ORANGE_HEX)('Email')}
此參數請設定要發送的Email(可發多個)`,
  }),
  'ci-slack': flags.boolean({
    description: `備份完成後發通知${chalk.hex(COLOR.ORANGE_HEX)('Slack')}`,
  }),
  'ssl-ca': flags.string({
    description: `MySQL SSL CA檔案路徑`,
  }),
  'ssl-cert': flags.string({
    description: `MySQL SSL CERT檔案路徑`,
  }),
  'ssl-key': flags.string({
    description: `MySQL SSL KEY檔案路徑`,
  }),
}

module.exports = dbDump
