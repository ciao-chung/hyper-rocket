const {Command, flags} = require('@oclif/command')
const cli = require('cli-ux')
class InstallServer extends Command {
  async run() {
    const {args, flags} = this.parse(InstallServer)
    global.removeSudo = flags.removeSudo
    this.version = args.version
    this.rootPassword = flags.password
    if(!this.rootPassword) {
      this.rootPassword = await cli.ux.prompt('Root password?', {
        type: 'hide',
      })
    }

    await execAsync(`sudo apt-get update`)
    await execAsync(`echo "mysql-server mysql-server/root_password password ${this.rootPassword}" | sudo debconf-set-selections`)
    await execAsync(`echo "mysql-server mysql-server/root_password_again password ${this.rootPassword}" | sudo debconf-set-selections`)
    await execAsync(`sudo apt-get install mysql-server-${this.version} -y`)
    await execAsync(`sudo service mysql start`)
    await execAsync(`mysql --version`)
  }
}

InstallServer.description = `
安裝MySQL Server
建議可先從${chalk.hex(COLOR.ORANGE_HEX).bold('apt-cache search mysql | grep mysql-server')}指令查看可使用版本
各個系統可使用版本都不太相同
一般為5.7或是5.7、8.0
`

InstallServer.args = [
  {
    name: 'version',
    required: true,
    description: 'MySQL版本',
    options: ['5.7', '8.0'],
  }
]

InstallServer.flags = {
  password: flags.string({
    char: 'p',
    description: `root密碼
使用此參數將不會出現互動式密碼問答`,
  }),
  removeSudo: global.removeSudoFlag(flags),
}

module.exports = InstallServer
