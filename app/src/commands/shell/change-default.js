const {Command, flags} = require('@oclif/command')
require('../../kernel')
const os = require('os')
const { existsSync } = require('fs')
class changeDefault extends Command {
  async run() {
    const {flags} = this.parse(changeDefault)
    global.removeSudo = flags.removeSudo
    this.commandFlags = flags
    if(!existsSync(flags.path)) {
      logger(`shell path不存在(${flags.path})`, 'red')
      return
    }

    logger(`即將執行指令`);
    logger(`sudo usermod -s ${flags.path} ${os.userInfo().username}`);
    await execDelay(10)
    await execAsync(`sudo usermod -s ${flags.path} ${os.userInfo().username}`)
  }
}

changeDefault.description = `
安裝Fish Shell
`

changeDefault.flags = {
  path: flags.string({
    name: 'path',
    char: 'p',
    required: true,
    description: `Shell Path
可用${chalk.hex(COLOR.ORANGE_HEX)('cat /etc/shells')}查詢要使用的shell path`,
  }),
  removeSudo: global.removeSudoFlag(flags),
}

module.exports = changeDefault
