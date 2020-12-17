const qs = require('qs')
const ciConfigService = require('@services/ciConfigService.js')
const axios = require('axios')
class lineNotifyService {
  async init() {
    this.serviceEnabled = ciConfigService.ciConfigExist() === true
    this.ciConfig = ciConfigService.getCiConfig()


  }

  /**
   * 官方文件: https://notify-bot.line.me/doc/en/
   * Sticker List: https://developers.line.biz/media/messaging-api/sticker_list.pdf
   */
  async send(params) {
    if(!this.serviceEnabled) {
      logger(`無法使用Line Notify API`, 'red')
      logger(`CI設定檔${ciConfigService.getCiConfigFilePath()}不存在或是格式不正確`, 'red')
      return
    }

    if(typeof params === 'string') {
      params = { message: params }
    }

    try {
      const result = await axios({
        url: 'https://notify-api.line.me/api/notify',
        method: 'post',
        headers: {
          Authorization: `Bearer ${this.ciConfig.LINE_NOTIFY_TOKEN}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify(params, { arrayFormat: 'indices' }),
      })
      logger(`Line Notify API發送完成`, 'green')
    } catch (error) {
      logger(error.message, 'red')
    }
  }
}

module.exports = new lineNotifyService()
