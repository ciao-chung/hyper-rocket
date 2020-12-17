require('../../kernel.js')
const init = require('@modules/deploy/actions/init')
const fetchSource = require('@modules/deploy/actions/fetchSource')
const build = require('@modules/deploy/actions/build')
const publish = require('@modules/deploy/actions/publish')
const extraService = require('@modules/deploy/actions/extraService')
const cleanup = require('@modules/deploy/actions/cleanup')
const integration = require('@modules/deploy/integration')
class deployService {
  // 執行佈署
  async start(options) {
    try {
      await init.process(options)
      await fetchSource.process(options)
      await build.process(options)
      await publish.process(options)
      await extraService.process(options)
      await cleanup.process(options)
      await integration.onSuccess()
      notify(`🎉 ${DEPLOY_ENV.DEPLOY_LABEL}佈署完成`)
      this._showInformation()
    } catch (error) {
      await integration.onFailure(error)
      notify(`🌧 ${DEPLOY_ENV.DEPLOY_LABEL}佈署失敗`)
      this._showInformation()
      throw error
    }
  }

  _showInformation() {
    const start = DEPLOY_ENV.TIMELINE.START
    const end = now()
    DEPLOY_ENV.TIMELINE.END = end
    logger(`🔥 [DEPLOY INFO] 佈署完成`, 'blue')
    logger(``, 'white')
    logger(`==========相關資訊==========`, 'white')
    logger(`起始時間: ${start}`, 'white')
    logger(`結束時間: ${end}`, 'white')
    logger(`====================`, 'white')
    logger(``, 'white')
  }
}

module.exports = new deployService()
