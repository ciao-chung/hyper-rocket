const {Command, flags} = require('@oclif/command')
require('../../kernel.js')
const deployService = require('@modules/deploy/deployService.js')
class execute extends Command {
  async run() {
    const {flags} = this.parse(execute)
    global.removeSudo = flags.removeSudo
    await deployService.start(flags)
  }
}

execute.description = `執行佈署`

execute.flags = {
  config: flags.string({
    char: 'c',
    description: '佈署設定檔案',
  }),
  workdir: flags.string({
    description: '工作目錄資料夾位置',
  }),
  workdirName: flags.string({
    description: '工作目錄名稱',
  }),
  skip: flags.string({
    description: `跳過佈署階段
可跳過階段: fetch, build, publish, extra-service, cleanup, ci
    `,
    options: ['fetch', 'build', 'publish', 'extra-service', 'cleanup', 'ci'],
    multiple: true,
    default: [],
  }),
  migrate: flags.boolean({
    description: 'Publish完成後自動執行Laravel Migrate(僅Laravel佈署才有效)',
    default: false,
  }),
  dump: flags.boolean({
    description: 'Dump佈署設定檔(不執行任何佈署動作)',
    default: false,
  }),
  dumpEnv: flags.boolean({
    description: 'Dump出所有的Deploy相關環境變數(不執行任何佈署動作)',
    default: false,
  }),
  removeSudo: global.removeSudoFlag(flags),
}

module.exports = execute
