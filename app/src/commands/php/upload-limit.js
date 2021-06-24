require('../../kernel.js')
const {existsSync} = require('fs')
const {Command, flags, args } = require('@oclif/command')

class uploadLimit extends Command {
  async run() {
    const { args, flags} = this.parse(uploadLimit)
    global.removeSudo = flags.removeSudo
    this.phpIniPath = flags.path
    this.size = flags.size
    logger(`開始設定最大上傳限制: ${this.phpIniPath}`, 'yellow')
    await this._setupFile()
    await execAsync(`cat ${this.phpIniPath} | grep upload_max_filesize`)
    await execAsync(`cat ${this.phpIniPath} | grep post_max_size`)
  }

  async _setupFile() {
    if(existsSync(this.phpIniPath) == false) {
      logger(`找不到${this.phpIniPath}`, 'red')
      return
    }
    await execAsync(`sudo sed -i 's,^upload_max_filesize =.*$,upload_max_filesize = ${this.size},' ${this.phpIniPath}`)
    await execAsync(`sudo sed -i 's,^post_max_size =.*$,post_max_size = ${this.size},' ${this.phpIniPath}`)
  }
}

uploadLimit.description = `
設定php最大上傳限制
如果有使用php-fpm請設定/etc/php/7.x/fpm/php.ini
`

uploadLimit.flags = {
  path: flags.string({
    description: `php.ini路徑, 可透過${chalk.hex(COLOR.ORANGE_HEX)('hyper-rocket php:ini')}指令找出`,
    required: true,
  }),
  size: flags.string({
    description: `大小(例如: 8M, ${chalk.hex(COLOR.ORANGE_HEX)('單位不可加B')})`,
    required: true,
  }),
  removeSudo: global.removeSudoFlag(flags),
}

module.exports = uploadLimit
