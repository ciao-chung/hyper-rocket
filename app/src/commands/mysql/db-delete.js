const {Command, flags} = require('@oclif/command')
const cli = require('cli-ux')
const { env } = require('shelljs')
class dbDelete extends Command {
  async run() {
    const {args, flags} = this.parse(dbDelete)
    global.removeSudo = flags.removeSudo
    this.db = args.name
    this.rootPassword = flags.password
    if(!this.rootPassword) {
      this.rootPassword = await cli.ux.prompt('Root password?', {
        type: 'hide',
      })
    }

    try {
      env['MYSQL_PWD'] = this.rootPassword
      await execAsync(`mysql -uroot -e "DROP DATABASE IF EXISTS ${this.db}"`)
      await execAsync(`mysql -uroot -e "SHOW DATABASES;"`)
    } catch(error) {
      logger(`MySQL資料庫刪除失敗: ${JSON.stringify(error)}`, 'red')
    }
  }
}

dbDelete.description = `
刪除資料庫`

dbDelete.args = [
  {
    name: 'name',
    required: true,
    description: '資料庫名稱',
  }
]

dbDelete.flags = {
  password: flags.string({
    char: 'p',
    description: `root密碼
使用此參數將不會出現互動式密碼問答`,
  }),
  removeSudo: global.removeSudoFlag(flags),
}

module.exports = dbDelete
