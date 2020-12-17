const {Command, flags} = require('@oclif/command')
require('../../kernel')
const cli = require('cli-ux')
const ciConfigService = require('@services/ciConfigService.js')
const inquirer = require('inquirer')
class config extends Command {
  async run() {
    const {flags} = this.parse(config)
    if(ciConfigService.ciConfigExist() === true) {
      const confirm = await cli.ux.confirm(this._getConfirmMessage())
      if(!confirm) process.exit()
    }

    this.config = await inquirer.prompt([
      {
        type: 'list',
        name: 'MAIL_DRIVER',
        message: 'Mail Driver',
        choices: [{ name: 'smtp' }],
      },
      {
        type: 'text',
        name: 'MAIL_FROM_ADDRESS',
        message: '發信Mail Address',
      },
      {
        type: 'text',
        name: 'MAIL_FROM_NAME',
        message: '發信名稱',
        default: '🚀 Hyper Rocket',
      },
      {
        type: 'text',
        name: 'MAIL_SMTP_HOST',
        message: 'SMTP HOST',
        default: 'smtp.gmail.com',
      },
      {
        type: 'text',
        name: 'MAIL_SMTP_PORT',
        message: 'SMTP PORT',
        default: '587',
      },
      {
        type: 'text',
        name: 'MAIL_SMTP_USERNAME',
        message: 'SMTP帳號',
      },
      {
        type: 'password',
        name: 'MAIL_SMTP_PASSWORD',
        message: 'SMTP密碼',
        default: '',
      },
      {
        type: 'text',
        name: 'SLACK_WEBHOOK',
        message: 'Slack Webhook URL',
      },
      {
        type: 'text',
        name: 'LINE_NOTIFY_TOKEN',
        message: 'Line Notify API Token',
      },
    ])

    this._setupDefaultValue()
    await this._saveFile()

  }

  _setupDefaultValue() {
    for(const key in this.config) {
      const value = this.config[key]
      if(!!value) continue
      this.config[key] = key
    }
  }

  async _saveFile() {
    const configPath = ciConfigService.getCiConfigFilePath()
    const content = global.renderService.render('ci/ci.yml', this.config)
    await writeFile(configPath, content)
    logger(`CI設定完成`, 'green')
    logger(`後續可手動修改設定檔: ${configPath}`, 'green')
  }

  _getConfirmMessage() {
    const configPath = ciConfigService.getCiConfigFilePath()
    return `CI設定檔已經存在(${configPath})
確定要重新設定(y/n)?`
  }
}

config.description = `設定CI
讓Hyper Rocket可以在特定的時機使用Slack、Email、Line Notify做通知
`

module.exports = config
