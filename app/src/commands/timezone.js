const {Command, flags} = require('@oclif/command')
require('../kernel.js')
class timezone extends Command {
  async run() {
    const {flags} = this.parse(timezone)
    global.removeSudo = flags.removeSudo
    this.timezone = flags.timezone
    await execAsync(`sudo timedatectl set-timezone ${this.timezone}`)
  }
}

timezone.description = `設定時區`

timezone.flags = {
  timezone: flags.string({
    char: 't',
    default: 'Asia/Taipei',
    description: `時區`,
  }),
  removeSudo: global.removeSudoFlag(flags),
}

module.exports = timezone
