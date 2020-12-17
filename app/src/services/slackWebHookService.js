const ciConfigService = require('@services/ciConfigService.js')
const axios = require('axios')
class slackWebHookService {
  async init() {
    this.serviceEnabled = ciConfigService.ciConfigExist() === true
    this.ciConfig = ciConfigService.getCiConfig()


  }

  async send(slackMessages = {}) {
    if(!this.serviceEnabled) {
      logger(`無法使用Slack Webhook`, 'red')
      logger(`CI設定檔${ciConfigService.getCiConfigFilePath()}不存在或是格式不正確`, 'red')
      return
    }

    /**
     * 官方文件: https://api.slack.com/messaging/webhooks
     */
    const slackMessagesSample = {
      text: '🚀 HYPER ROCKET通知',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `**Message**`,
          },
        },
      ],
    }

    try {
      const result = await axios({
        url: this.ciConfig.SLACK_WEBHOOK,
        method: 'post',
        responseType: 'json',
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify(slackMessages),
      })
      logger(`Slack通知發送完成`, 'green')
    } catch (error) {
      logger(error, 'red')
    }
  }
}

module.exports = new slackWebHookService()
