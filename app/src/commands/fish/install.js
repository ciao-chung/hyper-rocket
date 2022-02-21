const {Command, flags} = require('@oclif/command')
require('../../kernel')
const fish = require('@modules/fish/fish.js')
class fishInstall extends Command {
  async run() {
    const {flags} = this.parse(fishInstall)
    global.removeSudo = flags.removeSudo
    this.commandFlags = flags
    await fish.install(flags.version)
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
  version: flags.string({
    name: 'version',
    char: 'v',
    description: `Fish Shell版本`,
    options: ['2', '3'],
    default: '2',
  }),
  removeSudo: global.removeSudoFlag(flags),
}

module.exports = fishInstall
