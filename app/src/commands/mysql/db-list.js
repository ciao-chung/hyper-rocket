const {Command, flags} = require('@oclif/command')
const cli = require('cli-ux')
const { env } = require('shelljs')
class dbList extends Command {
  async run() {
    const {args, flags} = this.parse(dbList)
    global.removeSudo = flags.removeSudo
    this.rootPassword = flags.password
    if(!this.rootPassword) {
      this.rootPassword = await cli.ux.prompt('Root password?', {
        type: 'hide',
      })
    }

    env['MYSQL_PWD'] = this.rootPassword
    await execAsync(`mysql -uroot -e "SHOW DATABASES;"`)
  }
}

dbList.description = `
列出所有資料庫`

dbList.flags = {
  password: flags.string({
    char: 'p',
    description: `root密碼
使用此參數將不會出現互動式密碼問答`,
  }),
  removeSudo: global.removeSudoFlag(flags),
}

module.exports = dbList
