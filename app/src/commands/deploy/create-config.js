const {Command, flags} = require('@oclif/command')
require('../../kernel.js')
const deployConfigService = require('@modules/deployConfig/deployConfigService.js')
class createConfig extends Command {
  async run() {
    const {flags} = this.parse(createConfig)
    await deployConfigService.createConfig(flags)
  }
}

createConfig.description = `建立範例佈署設定檔`

createConfig.flags = {
  output: flags.string({
    char: 'o',
    description: '檔案輸出位置, 未指定則輸出在當下目錄',
    default: null,
  }),
  type: flags.string({
    char: 't',
    description: '佈署設定類型',
    default: 'default',
    options: ['default', 'vue', 'laravel'],
  }),
  removeSudo: global.removeSudoFlag(flags),
}

module.exports = createConfig
