const {Command, flags} = require('@oclif/command')
const cli = require('cli-ux')
const { env } = require('shelljs')
class remoteAccess extends Command {
  async run() {
    const {args, flags} = this.parse(remoteAccess)
    global.removeSudo = flags.removeSudo
    logger(`開始設定bind-address IP: ${args.address}`, 'cyan')
    await execAsync(`sudo sed -i "s/.*bind-address.*/bind-address = ${args.address}/" /etc/mysql/mysql.conf.d/mysqld.cnf`)
    await execAsync(`sudo cat /etc/mysql/mysql.conf.d/mysqld.cnf | grep bind-address`)
  }
}

remoteAccess.description = `
設定遠端存取`

remoteAccess.args = [
  {
    name: 'address',
    required: true,
    description: `存取IP
限制本機存取請輸入127.0.0.1
設定任何遠端皆可存取請使用0.0.0.1
多組IP請使用,逗號隔開`,
  }
]

remoteAccess.flags = {
  removeSudo: global.removeSudoFlag(flags),
}

module.exports = remoteAccess
