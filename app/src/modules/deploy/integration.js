const _deployAction = require('./actions/_deployAction')
const ciConfigService = require('@services/ciConfigService.js')
const mailService = require('@services/mailService.js')
const slackWebHookService = require('@services/slackWebHookService.js')
const lineNotifyService = require('@services/lineNotifyService.js')
class integration extends _deployAction {
  constructor() {
    super()
    this.stage = 'ci'
    this.mailService = mailService
    this.slackWebHookService = slackWebHookService
    this.lineNotifyService = lineNotifyService
  }

  async _init() {
    this.serviceEnabled = ciConfigService.ciConfigExist() === true
    if(!this.serviceEnabled) return
    this.mailService.init()
    this.slackWebHookService.init()
    this.lineNotifyService.init()
    this.deployName = DEPLOY_ENV.CONFIG.info.label
  }

  _mailEnabled() {
    if(!DEPLOY_ENV.CONFIG.ci) return false
    if(!DEPLOY_ENV.CONFIG.ci.enable) return false
    if(!Array.isArray(DEPLOY_ENV.CONFIG.ci.mail)) return false
    return DEPLOY_ENV.CONFIG.ci.mail.length > 0
  }

  _slackEnabled() {
    if(!DEPLOY_ENV.CONFIG.ci) return false
    if(!DEPLOY_ENV.CONFIG.ci.enable) return false
    return DEPLOY_ENV.CONFIG.ci.slack === true
  }

  _lineNotifyEnabled() {
    if(!DEPLOY_ENV.CONFIG.ci) return false
    if(!DEPLOY_ENV.CONFIG.ci.enable) return false
    return DEPLOY_ENV.CONFIG.ci.lineNotify === true
  }

  async onSuccess() {
    if(this._shouldSkip(this.stage) === true) {
      logger(`跳過CI階段`, 'yellow')
      return
    }

    this._outputStage(`開始執行佈署成功CI通知`)
    const title = `🚀️ HYPER ROCKET佈署完成通知 🎉`
    await this._init()
    if(this._mailEnabled()) {
      mailService.send({
        subject: title,
        targets: DEPLOY_ENV.CONFIG.ci.mail,
        text: `🚀️ *${this.deployName}佈署完成 🎉*\t${now()}`,
      })
    }

    if(this._slackEnabled()) {
      slackWebHookService.send({
        text: title,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `🚀️ *${this.deployName}佈署完成 🎉*\t${now()}`,
            },
          },
        ],
      })
    }

    if(this._lineNotifyEnabled()) {
      lineNotifyService.send(title)
    }
  }

  async onFailure(error) {
    if(global.deployOptions.skipCi === true) {
      logger(`跳過CI流程(因為CLI的skipCi選項)`, 'yellow')
      return
    }

    this._outputStage(`開始執行佈署失敗CI通知`)
    await this._init()
    const title = `🚀️ HYPER ROCKET佈署失敗通知 🌧`

    if(this._mailEnabled()) {
      mailService.send({
        subject: title,
        targets: DEPLOY_ENV.CONFIG.ci.mail,
        text: `🚀 *${this.deployName}佈署失敗 🌧*\t${now()}`,
        html: `<h2>錯誤訊息</h2><p><br><br></p><p>${error}</p>`
      })
    }

    if(this._slackEnabled()) {
      slackWebHookService.send({
        text: title,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `🚀️ *${this.deployName}佈署失敗 🌧*\t${now()}`,
            },
          },
        ],
      })
    }

    if(this._lineNotifyEnabled()) {
      lineNotifyService.send(title)
    }

  }
}

module.exports = new integration()
