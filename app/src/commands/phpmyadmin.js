const {Command, flags} = require('@oclif/command')
const cli = require('cli-ux')
require('../kernel.js')
class phpmyadmin extends Command {
  async run() {
    const {flags} = this.parse(phpmyadmin)
    global.removeSudo = flags.removeSudo
    this.commandFlags = flags
    this.rootPassword = flags.password
    this.version = await getPhpVersion()

    if(!this.version) {
      logger('尚未安裝php', 'yellow')
      return
    }

    if(!this.rootPassword) {
      this.rootPassword = await cli.ux.prompt('MySQL Root password?', {
        type: 'hide',
      })
    }

    await this._install()
    await this._setupTimeout()
    await execAsync(`sudo service apache2 restart`)
  }

  async _install() {
    await execAsync(`sudo apt-get update`)
    await execAsync(`echo "phpmyadmin phpmyadmin/dbconfig-install boolean true" | sudo debconf-set-selections`)
    await execAsync(`echo "phpmyadmin phpmyadmin/app-password-confirm password ${this.rootPassword}" | sudo debconf-set-selections`)
    await execAsync(`echo "phpmyadmin phpmyadmin/mysql/admin-pass password ${this.rootPassword}" | sudo debconf-set-selections`)
    await execAsync(`echo "phpmyadmin phpmyadmin/mysql/app-pass password ${this.rootPassword}" | sudo debconf-set-selections`)
    await execAsync(`echo "phpmyadmin phpmyadmin/reconfigure-webserver multiselect apache2" | sudo debconf-set-selections`)
    await execAsync(`sudo add-apt-repository ppa:phpmyadmin/ppa -y`, {
      ignoreError: true,
    })
    await execAsync(`sudo apt-get install phpmyadmin -y`)
    await execAsync(`sudo a2enmod rewrite`)
    await execAsync(`sudo service apache2 restart`)
  }

  async _setupTimeout() {
    const ttl = 86400
    const phpIniPath = this.commandFlags.phpIni
    await execAsync(`sudo sed -i 's,^session.gc_maxlifetime =.*$,session.gc_maxlifetime = ${ttl},' ${phpIniPath}`)
    const configIncPhp = '/etc/phpmyadmin/config.inc.php'
    await appendFile(configIncPhp, `\n$cfg['LoginCookieValidity'] = ${ttl};\n`)
  }
}

phpmyadmin.description = `安裝phpmyadmin`


phpmyadmin.flags = {
  password: flags.string({
    char: 'p',
    description: `MySQL root密碼
使用此參數將不會出現互動式密碼問答
php 7.4以上需要手動更新phpmyadmin至5.x版本
參考連結: https://devanswers.co/manually-upgrade-phpmyadmin/
`,
  }),
  phpIni: flags.string({
    char: 'i',
    description: `php.ini路徑, 可透過${chalk.hex(COLOR.ORANGE_HEX)('hyper-rocket php:ini')}指令找出`,
    required: true,
  }),
  removeSudo: global.removeSudoFlag(flags),
}

module.exports = phpmyadmin
