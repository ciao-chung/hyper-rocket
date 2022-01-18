const {Command, flags} = require('@oclif/command')
const cli = require('cli-ux')
const { env } = require('shelljs')
const { resolve } = require('path')
const { existsSync } = require('fs')
class dbImport extends Command {
  async run() {
    const {args, flags} = this.parse(dbImport)
    this.flags = flags
    this.username = flags.username
    this.password = flags.password
    this.file = flags.file
    this.db = args.name
    this.password = flags.password
    if(!this.password) {
      this.password = await cli.ux.prompt('Root password?', {
        type: 'hide',
      })
    }

    if(existsSync(this.file) === false) {
      logger(`MySQL檔案不存在: ${this.file}`, 'red')
      return
    }


    await execAsync(`mysql -u ${this.username} -p${this.password} ${this.db} < ${this.file}`)
  }

}

dbImport.description = `
匯入資料庫`

dbImport.args = [
  {
    name: 'name',
    required: true,
    description: '資料庫名稱',
  }
]

dbImport.flags = {
  file: flags.string({
    char: 'f',
    required: true,
    description: `MySQL檔案路徑`,
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
}

module.exports = dbImport
