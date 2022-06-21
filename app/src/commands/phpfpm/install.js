require('../../kernel.js')
const {Command, flags, args } = require('@oclif/command')

class install extends Command {
  async run() {
    const { args, flags} = this.parse(install)
    this.version = args.version
    global.removeSudo = flags.removeSudo
    this.commandFlags = flags

    await execAsync(`sudo mkdir -p /run/php`)
    await execAsync(`sudo chmod 0755 /run/php`)
    await execAsync(`sudo chown www-data:www-data /run/php`)
    await execAsync(`sudo apt-get install php${this.version}-fpm -y`)
    const wwwConf = global.renderService.render('php-fpm/www.conf', {
      phpVersion: this.version,
      max_children: 50,
      start_servers: 20,
      min_spare_servers: 10,
      max_requests: 500,
    })
    await writeFileAsRoot(`/etc/php/${this.version}/fpm/pool.d/www.conf`, wwwConf)
    await execAsync(`php -v`)
  }
}

install.description = `
安裝php-fpm`

install.args = [
  {
    name: 'version',
    required: true,
    description: 'php版本',
    options: ['7.1', '7.2', '7.3', '7.4', '8.0', '8.1'],
  }
]

install.flags = {
  removeSudo: global.removeSudoFlag(flags),
}

module.exports = install
