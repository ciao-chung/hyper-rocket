require('../../kernel.js')
const {Command, flags, args } = require('@oclif/command')
const phpFpmService = require('@services/phpFpmService.js')
class setup extends Command {
  async run() {
    const { args, flags} = this.parse(setup)
    global.removeSudo = flags.removeSudo
    this.commandFlags = flags
    this.commandFlags.type
    await phpFpmService.setup(this.commandFlags.type, this.commandFlags.restart)
  }
}

setup.description = `
調整php-fpm設定(/etc/php/7.x/fpm/pool.d/www.conf)`

setup.flags = {
  type: flags.string({
    char: 't',
    description: '效能類型(high, low)',
    options: ['high', 'low'],
    required: true,
  }),
  restart: flags.boolean({
    description: '調整完成後是否自動重啟php-fpm',
    default: true,
  }),
  removeSudo: global.removeSudoFlag(flags),
}

module.exports = setup
