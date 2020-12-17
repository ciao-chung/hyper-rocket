const { resolve } = require('path')
const _deployAction = require('../actions/_deployAction.js')
class _baseExtraServiceHandler extends _deployAction{
  async process() {
    this._validateDistPath()
    this._validServers()

    // rsync to each server
    for (const index in DEPLOY_ENV.CONFIG.servers) {
      const server = DEPLOY_ENV.CONFIG.servers[index]
      const no = parseInt(index)+1
      try {
        await this._setupEachServerExtraService(index, server)
        const notification = `第${no}台Server額外服務設定完成`
        this._outputStage(notification)
        notify(notification)
      } catch (error) {
        const notification = `第${no}台Server額外服務設定中斷`
        this._outputStage(notification)
        logger(error, 'red')
        notify(notification)
      }
    }
  }
  async _setupEachServerExtraService(index, server) {
    // TODO
  }

}


module.exports = _baseExtraServiceHandler
