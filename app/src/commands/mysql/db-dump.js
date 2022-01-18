const {Command, flags} = require('@oclif/command')
const cli = require('cli-ux')
const { env } = require('shelljs')
const { resolve } = require('path')
const { readdirSync } = require('fs')
class dbDump extends Command {
  async run() {
    const {args, flags} = this.parse(dbDump)
    this.flags = flags
    this.username = flags.username
    this.password = flags.password
    this.outputPath = flags.output
    this.db = flags.db

    console.warn('flags.s3', flags.s3)

    this.password = flags.password
    if(!this.password) {
      this.password = await cli.ux.prompt('Root password?', {
        type: 'hide',
      })
    }
    this.maxFileQuantity = flags.max

    this.subFolderName = now('YYYYMMDD_HHmmss')
    this.folderPath = resolve(this.outputPath, this.subFolderName)
    await execAsync(`mkdir -p ${this.folderPath}`)
    await this.dumpDatabases()
    await this.removeOverLimitFiles()
    await this.backupToS3()
    await this.backupToGit()
  }

  async dumpDatabases() {
    for(const db of this.db) {
      await this.dumpDatabaseItem(db)
    }
  }

  async dumpDatabaseItem(dbName) {
    const filePath = `${this.subFolderName}/${dbName}.sql`
    try {
      await execAsync(`mysqldump -u ${this.username} -p${this.password} ${dbName} > ${filePath}`, {
        cwd: this.outputPath,
      })
      logger(`${dbName}匯出完成`, 'yellow')
    } catch (error) {
      // 刪除匯出失敗sql檔案
      await execAsync(`rm ${filePath}`, { cwd: this.outputPath })
      logger(`${dbName}匯出失敗`, 'yellow')
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

    for(const index in files) {
      const file = files[index]
      const fileIndex = parseInt(index)+1
      if(fileIndex < this.maxFileQuantity) continue
      const folderFullPath = resolve(this.outputPath, file)
      logger(`正在刪除過期備份: ${file}`, 'yellow')
      await execAsync(`rm -r ${folderFullPath}`, { cwd: this.outputPath })
    }
  }

  async backupToS3() {
    this.s3Arn = this.flags.s3
    if(!this.s3Arn) return
    logger(`即將備份至S3`, 'cyan'),
    // await execAsync(`aws s3 rm ${this.s3Arn} --recursive`)
    await execAsync(`aws s3 sync ${this.outputPath} ${this.s3Arn} --exclude ".git/*" --delete`)
  }

  async backupToGit() {

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
選項將使用${chalk.hex(COLOR.ORANGE_HEX)('git')}來做備份`,
  }),
}

module.exports = dbDump
