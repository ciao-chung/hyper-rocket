const {Command, flags} = require('@oclif/command')
require('../../kernel')
const fish = require('@modules/fish/fish.js')
class fishTheme extends Command {
  async run() {
    const {flags} = this.parse(fishTheme)
    global.removeSudo = flags.removeSudo
    this.commandFlags = flags
    await fish.setupTheme(flags.theme)
  }
}

fishTheme.description = `
設定Fish Shell Theme
`

fishTheme.flags = {
  theme: flags.string({
    name: 'theme',
    char: 't',
    description: `Fish Theme
主題來自: https://github.com/oh-my-fish/oh-my-fish/blob/master/docs/Themes.md
`,
    options: ['gitstatus', 'bobthefish'],
    default: 'gitstatus',
  }),
  removeSudo: global.removeSudoFlag(flags),
}

module.exports = fishTheme
