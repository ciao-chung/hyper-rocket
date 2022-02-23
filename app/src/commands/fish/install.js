const {Command, flags} = require('@oclif/command')
require('../../kernel')
const fish = require('@modules/fish/fish.js')
class fishInstall extends Command {
  async run() {
    const {flags} = this.parse(fishInstall)
    global.removeSudo = flags.removeSudo
    this.commandFlags = flags
    await fish.install(flags.defaultShell)
    await fish.setupTheme(flags.theme)
  }
}

fishInstall.description = `
安裝Fish Shell
`

fishInstall.flags = {
  theme: flags.string({
    name: 'theme',
    char: 't',
    description: `Fish Theme
主題來自: https://github.com/oh-my-fish/oh-my-fish/blob/master/docs/Themes.md
`,
    options: ['gitstatus', 'bobthefish'],
    default: 'gitstatus',
  }),
  defaultShell: flags.boolean({
    name: 'defaultShell',
    char: 'd',
    description: `將Fish Shell設定為預設Shell, 預設為false`,
    default: false,
  }),
  removeSudo: global.removeSudoFlag(flags),
}

module.exports = fishInstall
