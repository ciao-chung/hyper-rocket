const {Command, flags} = require('@oclif/command')
const cli = require('cli-ux')
const { env } = require('shelljs')
class dbCreate extends Command {
  async run() {
    const {args, flags} = this.parse(dbCreate)
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
      await execAsync(`mysql -uroot -e "CREATE DATABASE IF NOT EXISTS ${this.db} CHARACTER SET utf8 COLLATE utf8_general_ci"`)
      await execAsync(`mysql -uroot -e "SHOW DATABASES;"`)
    } catch(error) {
      logger(`MySQL資料庫建立失敗: ${JSON.stringify(error)}`, 'red')
    }
  }
}

dbCreate.description = `
建立資料庫`

dbCreate.args = [
  {
    name: 'name',
    required: true,
    description: '資料庫名稱',
  }
]

dbCreate.flags = {
  password: flags.string({
    char: 'p',
    description: `root密碼
使用此參數將不會出現互動式密碼問答`,
  }),
  removeSudo: global.removeSudoFlag(flags),
}

module.exports = dbCreate
