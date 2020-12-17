const {Command, flags} = require('@oclif/command')
const { readFileSync } = require('fs')
const { resolve } = require('path')
require('../kernel.js')
class apache extends Command {
  async run() {
    const {flags, args} = this.parse(apache)
    global.removeSudo = flags.removeSudo
    this.commandFlags = flags
    this.phpVersion = await getPhpVersion()
    if(!this.phpVersion) {
      logger('尚未安裝php', 'yellow')
      return
    }
    await this._installApache()
    this.apacheConfigFilePath = '/etc/apache2/apache2.conf'
    this.apacheConfigContent = await readFileSync(this.apacheConfigFilePath, 'utf8')
    await this._setupHomePage()
    await this._setupSecurity()
  }

  async _installApache() {
    try {
      await execAsync(`sudo LC_ALL=C.UTF-8 add-apt-repository ppa:ondrej/php -y`)
    } catch {
      await execAsync(`sudo LC_ALL=C.UTF-8 add-apt-repository ppa:ondrej/php -r -y`)
    }
    await execAsync(`sudo apt-get update`)
    try {
      await execAsync(`sudo apt-get install libapache2-mod-php${this.phpVersion} -y`)
    } catch (error) {
      logger(`${error}`, 'yellow')
      await execAsync(`sudo apt-get install -y -f`)
    }
    await execAsync(`sudo a2enmod rewrite`)
    await execAsync(`sudo a2enmod headers`)
    await execAsync(`sudo a2enmod proxy`)
    await execAsync(`sudo a2enmod proxy_http`)
    await execAsync(`sudo service apache2 restart`)
  }

  async _setupHomePage() {
    const indexHtml = global.renderService.render('/apache/index.html')
    const configPath = `/var/www/html/index.html`
    await writeFileAsRoot(configPath, indexHtml)
  }

  async _setupSecurity() {
    if(!this._isMatchApacheConfig('ServerTokens Prod')) {
      this.apacheConfigContent += '\nServerTokens Prod'
    }

    if(!this._isMatchApacheConfig('ServerSignature Off')) {
      this.apacheConfigContent += '\nServerSignature Off'
    }
  }

  _isMatchApacheConfig(string) {
    return new RegExp(string, 'g').test(this.apacheConfigContent)
  }
}

apache.description = `安裝Apache reverse proxy server`

apache.flags = {
  removeSudo: global.removeSudoFlag(flags),
}

module.exports = apache
