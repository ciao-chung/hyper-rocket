const {Command, flags} = require('@oclif/command')
const cli = require('cli-ux')
const { env } = require('shelljs')
class userCreate extends Command {
  async run() {
    const {args, flags} = this.parse(userCreate)
    global.removeSudo = flags.removeSudo
    this.username = args.username
    this.rootPassword = flags.password
    if(!this.rootPassword) {
      this.rootPassword = await cli.ux.prompt('Root password?', {
        type: 'hide',
      })
    }

    this.userPassword = flags.userPassword
    if(!this.userPassword) {
      this.userPassword = await cli.ux.prompt('User password?', {
        type: 'hide',
      })
    }

    try {
      env['MYSQL_PWD'] = this.rootPassword
      if(flags.ver8) {
        await execAsync(`mysql -uroot -e "CREATE USER '${this.username}'@'%' IDENTIFIED BY '${this.userPassword}';"`, {
          quiet: true,
        })
        await execAsync(`mysql -uroot -e "ALTER USER ${this.username} IDENTIFIED WITH mysql_native_password BY '${this.userPassword}';"`, {
          quiet: true,
        })
      }

      else {
        await execAsync(`mysql -uroot -e "GRANT ALL PRIVILEGES ON *.* TO '${this.username}'@'%' IDENTIFIED BY '${this.userPassword}' WITH GRANT OPTION"`, {
          quiet: true,
        })
      }
      await execAsync(`mysql -uroot -e "FLUSH PRIVILEGES"`)
      await execAsync(`mysql -uroot -e "SELECT user FROM mysql.user"`)
    } catch(error) {
      logger(`MySQL帳號建立失敗: ${JSON.stringify(error)}`, 'red')
    }
  }
}

userCreate.description = `
建立MySQL使用者`

userCreate.args = [
  {
    name: 'username',
    required: true,
    description: '使用者帳號',
  }
]

userCreate.flags = {
  password: flags.string({
    char: 'p',
    description: `root密碼
使用此參數將不會出現互動式密碼問答`,
  }),
  userPassword: flags.string({
    char: 'u',
    description: `使用者密碼
使用此參數將不會出現互動式密碼問答`,
  }),
  ver8: flags.boolean({ description: '使用MySQL 8的script' }),
  removeSudo: global.removeSudoFlag(flags),
}

module.exports = userCreate
