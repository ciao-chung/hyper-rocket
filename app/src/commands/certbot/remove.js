const {Command, flags} = require('@oclif/command')
const cli = require('cli-ux')
const inquirer = require('inquirer')
class remove extends Command {
  async run() {
    const {flags} = this.parse(remove)
    global.removeSudo = flags.removeSudo
    this.commandFlags = flags
    if(!flags.force) {
      // const result = await cli.ux.prompt(this._getPromptContent(), {
      const result = await inquirer.prompt([{
        name: 'continue',
        message: this._getPromptContent(),
        type: 'list',
        choices: [{name: 'yes'}, {name: 'no'}],
        default: 'no',
      }])
      if(result.continue != 'yes') {
        logger(`刪除${this.commandFlags.domain}的SSL憑證操作已取消`, 'yellow')
        this.exit()
        return
      }
    }

    logger(``)
    logger(`開始刪除${this.commandFlags.domain}的SSL憑證`)
    await execAsync(`sudo certbot delete --cert-name ${this.domain}`)
    await execAsync(`sudo nginx -t`)
    if(this.commandFlags.restart) {
      await execAsync(`sudo service nginx restart`)
    }
  }

  _getPromptContent() {
    const domain = chalk.hex(COLOR.YELLOW_HEX).bold(this.commandFlags.domain)
    return `確定要刪除${domain}的網域?
請先確認/etc/nginx/sites-enabled/內的${domain}設定已經移除
`
  }
}

remove.description = `
移除SSL憑證
`

remove.flags = {
  domain: flags.string({
    required: true,
    char: 'd',
    description: `要移除的SSL網域`,
  }),
  force: flags.boolean({
    description: `強制移除(不顯示確認prompt)`,
    default: false,
  }),
  restart: flags.boolean({
    description: `刪除後自動重新啟動nginx`,
    default: true,
  }),
  removeSudo: global.removeSudoFlag(flags),
}

module.exports = remove
