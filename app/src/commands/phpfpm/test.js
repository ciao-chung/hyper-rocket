require('../../kernel.js')
const {Command, flags, args } = require('@oclif/command')

class test extends Command {
  async run() {
    const { args, flags} = this.parse(test)
    global.removeSudo = flags.removeSudo
    this.commandFlags = flags
    this.version = await getPhpVersion()

    const command = this.commandFlags.detail === true ? '-tt' : '-t'
    await execAsync(`sudo php-fpm${this.version} ${command}`)
  }
}

test.description = `
測試php-fpm(php-fpm7.x -t)`

test.flags = {
  detail: flags.boolean({ char: 'd', description: '顯示詳細資訊', default: false }),
  removeSudo: global.removeSudoFlag(flags),
}

module.exports = test
