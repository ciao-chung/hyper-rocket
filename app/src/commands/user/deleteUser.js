const {Command, flags} = require('@oclif/command')
require('../../kernel.js')
class deleteUser extends Command {
  async run() {
    const {flags, args} = this.parse(deleteUser)
    global.removeSudo = flags.removeSudo
    this.username = args.username
    this.commandFlags = flags
    let command = `sudo deluser`
    if(flags.removeHome) {
      command = `${command} --remove-home`
    }
    await execDelay(5, chalk.hex(COLOR.YELLOW_HEX)(`刪除使用者${this.username}`))
    await execAsync(`${command} ${this.username}`, {
      ignoreError: true,
    })
  }
}

deleteUser.description = `
刪除使用者
`

deleteUser.args = [
  {
    name: 'username',
    required: true,
    description: '使用者名稱',
  },
]


deleteUser.flags = {
  removeHome: flags.boolean({
    description: '是否移除Home目錄',
    default: true,
  }),
  removeSudo: global.removeSudoFlag(flags),
}

module.exports = deleteUser
