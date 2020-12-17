require('../../kernel.js')
const {Command, flags, args } = require('@oclif/command')

class PhpInstallCommand extends Command {
  async run() {
    const { args, flags} = this.parse(PhpInstallCommand)
    this.version = args.version
    global.removeSudo = flags.removeSudo
    this.commandFlags = flags
    this.imagick = flags.imagick
    this.redis = flags.redis
    this.composerVersion = flags.composerVersion

    if(this.commandFlags.all === true || flags.base) {
      await this._beforeInstallPhp()
      await this._installPhp()
      await this._installComposer()
    }
    await this._installExtraExtension()
    if(flags.removeApache === true) {
      await this._removeApache()
    }
    await execAsync(`php -v`)
  }

  async _beforeInstallPhp() {
    await execAsync(`sudo apt-get update`)
    try {
      await execAsync(`sudo LC_ALL=C.UTF-8 add-apt-repository ppa:ondrej/php -y`)
    } catch {
      await execAsync(`sudo LC_ALL=C.UTF-8 add-apt-repository ppa:ondrej/php -r -y`)
    }
    await execAsync(`sudo apt-get update`)
  }

  async _installPhp() {
    this.log(`開始安裝php`)
    await execAsync(`sudo apt-get install php${this.version} -y`)
    await execAsync(`php --version`)
    await execAsync(`sudo apt-get install php${this.version}-mysql -y`)
    await execAsync(`sudo apt-get install php${this.version}-mbstring -y`)
    await execAsync(`sudo apt-get install php${this.version}-mcrypt -y`, {
      ignoreError: true,
    })
    await execAsync(`sudo apt-get install php${this.version}-gd -y`)
    await execAsync(`sudo apt-get install php${this.version}-zip -y`)
    await execAsync(`sudo apt-get install php${this.version}-dom -y`)
    await execAsync(`sudo apt-get install php${this.version}-xml -y`)
    await execAsync(`sudo apt-get install php${this.version}-curl -y`)
    await execAsync(`sudo apt-get install php${this.version}-bcmath -y`)
    await execAsync(`sudo apt-get install php${this.version}-xdebug -y`)
  }

  async _installComposer() {
    await execAsync(`sudo apt-get update`)
    await execAsync(`php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"`)
    await execAsync(`php composer-setup.php`)
    await execAsync(`php -r "unlink('composer-setup.php');"`)
    await execAsync(`sudo mv composer.phar /usr/local/bin/composer`)
    if(this.composerVersion) {
      await execAsync(`composer self-update ${this.composerVersion}`, {
        ignoreError: true,
      })
    }
    await execAsync(`composer`)
  }

  async _installExtraExtension() {
    if(this.commandFlags.all === true || this.imagick) {
      await execAsync(`sudo apt-get install imagemagick -y`)
      await execAsync(`sudo apt-get install php-imagick -y`)
      await execAsync(`php -m | grep imagick`)
    }

    if(this.commandFlags.all === true || this.redis) {
      await execAsync(`sudo apt-get install php-redis -y`)
    }
  }

  async _removeApache() {
    await execAsync(`sudo service apache2 stop`, {
      ignoreError: true,
    })
    await execAsync(`sudo apt-get remove --purge apache2 apache2-utils -y`)
    await execAsync(`rm -rf /etc/apache2-origin-bak`)
    await execAsync(`cp -r /etc/apache2 /etc/apache2-origin-bak`)
    await execAsync(`rm -rf /etc/apache2`)
    await execAsync(`sudo service apache2 status`, {
      ignoreError: true,
    })
  }
}

PhpInstallCommand.description = `
安裝php環境`

PhpInstallCommand.args = [
  {
    name: 'version',
    required: true,
    description: 'php版本',
    options: ['7.1', '7.2', '7.3', '7.4'],
  }
]

PhpInstallCommand.flags = {
  all: flags.boolean({ description: '全部選項都使用', default: false }),
  base: flags.boolean({ description: '基本安裝(php、常用extension)', default: true }),
  composerVersion: flags.string({
    description: '指定安裝composer版本, 不指定則安裝最新版',
    options: ['1.10.1'],
  }),
  imagick: flags.boolean({ description: '安裝php-imagick' }),
  redis: flags.boolean({ description: '安裝php-redis' }),
  removeApache: flags.boolean({ description: '移除apache', default: false }),
  removeSudo: global.removeSudoFlag(flags),
}

module.exports = PhpInstallCommand
