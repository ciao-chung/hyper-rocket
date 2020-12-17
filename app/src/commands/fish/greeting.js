const {Command, flags} = require('@oclif/command')
require('../../kernel')
const fish = require('@modules/fish/fish.js')
class fishInstall extends Command {
  async run() {
    const {flags} = this.parse(fishInstall)
    global.removeSudo = flags.removeSudo
    this.commandFlags = flags
    await fish.setupGreeting(flags.message, flags.color)
  }
}

fishInstall.description = `
設定Fish Shell問候語
`

fishInstall.flags = {
  message: flags.string({
    name: 'message',
    char: 'm',
    description: `單行文字訊息, 沒設定則代表清除問候語`,
    default: '',
  }),
  color: flags.string({
    name: 'color',
    char: 'c',
    description: `文字顏色
來自官方提供的顏色代碼: https://fishshell.com/docs/current/cmds/set_color.html
`,
    default: 'cyan',
    options: ['yellow', 'cyan', 'green', 'blue', 'magenta', 'white', 'brblack'],
  }),
  removeSudo: global.removeSudoFlag(flags),
}

module.exports = fishInstall
