const {Command, flags} = require('@oclif/command')
const slackWebHookService = require('@services/slackWebHookService.js')
class testSlackWebhook extends Command {
  async run() {
    const {flags} = this.parse(testSlackWebhook)
    slackWebHookService.init()
    slackWebHookService.send({
      text: `🚀 HYPER ROCKET測試通知`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*🚀 HYPER ROCKET測試通知: ${now()}*`,
          },
        },
      ],
    })
  }
}

testSlackWebhook.description = `測試CI Slack Webhook`

testSlackWebhook.flags = {}

module.exports = testSlackWebhook
