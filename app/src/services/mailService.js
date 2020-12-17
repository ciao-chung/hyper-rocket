const ciConfigService = require('@services/ciConfigService.js')
const nodemailer = require('nodemailer')
class mailService {
  async init() {
    this.serviceEnabled = ciConfigService.ciConfigExist() === true
    this.ciConfig = ciConfigService.getCiConfig()

    this.transporter = null
    switch (this.ciConfig.MAIL_DRIVER) {
      case 'smtp':
        this._setupSmtp()
        break
      default:
        this.serviceEnabled = false
        break
    }
  }

  _setupSmtp() {
    this.transporter = nodemailer.createTransport({
      host: this.ciConfig.MAIL_SMTP_HOST,
      port: this.ciConfig.MAIL_SMTP_PORT,
      secure: false,
      auth: {
        user: this.ciConfig.MAIL_SMTP_USERNAME,
        pass: this.ciConfig.MAIL_SMTP_PASSWORD,
      },
    })
  }

  async send(options = {}) {
    if(!this.serviceEnabled) {
      logger(`無法發送信件`, 'red')
      logger(`CI設定檔${ciConfigService.getCiConfigFilePath()}不存在或是格式不正確`, 'red')
      return
    }

    const targets = !Array.isArray(options.targets) ? [] : options.targets
    if(targets.length == 0) {
      logger(`請設定要發送的Mail`, 'yellow')
      return
    }
    await this.transporter.sendMail({
      from: this.ciConfig.MAIL_FROM_NAME,
      to: targets.toString(', '),
      subject: options.subject || '🚀 HYPER ROCKET',
      text: options.text || '',
      html: options.html || '',
    })
    logger(`Mail發送完成`, 'green')
  }
}

module.exports = new mailService()
