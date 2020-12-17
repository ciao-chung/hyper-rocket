require('../../kernel.js')
const {Command, flags, args } = require('@oclif/command')

class restart extends Command {
  async run() {
    const { args, flags} = this.parse(restart)
    global.removeSudo = flags.removeSudo
    this.commandFlags = flags
    this.version = await getPhpVersion()
    await execAsync(`sudo /usr/sbin/service php${this.version}-fpm restart`)
  }
}

restart.description = `
重啟php-fpm(service php7.x-fpm restart)`

restart.flags = {
  removeSudo: global.removeSudoFlag(flags),
}

module.exports = restart
