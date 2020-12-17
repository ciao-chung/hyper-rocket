const {Command, flags} = require('@oclif/command')
const cli = require('cli-ux')
const { env } = require('shelljs')
class userDelete extends Command {
  async run() {
    const {args, flags} = this.parse(userDelete)
    global.removeSudo = flags.removeSudo
    this.username = args.username
    this.rootPassword = flags.password
    if(!this.rootPassword) {
      this.rootPassword = await cli.ux.prompt('Root password?', {
        type: 'hide',
      })
    }

    try {
      env['MYSQL_PWD'] = this.rootPassword
      await execAsync(`mysql -uroot -e "DELETE FROM mysql.user WHERE user='${this.username}'"`)
      await execAsync(`mysql -uroot -e "FLUSH PRIVILEGES"`)
      await execAsync(`mysql -uroot -e "SELECT user FROM mysql.user"`)
    } catch(error) {
      logger(`MySQL帳號刪除失敗: ${JSON.stringify(error)}`, 'red')
    }
  }
}

userDelete.description = `
刪除MySQL使用者`

userDelete.args = [
  {
    name: 'username',
    required: true,
    description: '使用者帳號',
  }
]

userDelete.flags = {
  password: flags.string({
    char: 'p',
    description: `root密碼
使用此參數將不會出現互動式密碼問答`,
  }),
  removeSudo: global.removeSudoFlag(flags),
}

module.exports = userDelete
