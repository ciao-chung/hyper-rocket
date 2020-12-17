const _deployAction = require('./_deployAction.js')
class cleanup extends _deployAction {
  constructor() {
    super()
    this.stage = 'cleanup'
  }

  async process() {
    if(this._shouldSkip(this.stage) === true) {
      logger(`跳過Cleanup階段`, 'yellow')
      return
    }

    this._outputStage(`Cleanup: ${DEPLOY_ENV.WORKDIR}`)
    notify(`工作目錄清除完成: ${DEPLOY_ENV.SOURCE_PATH}`)
    await execAsync(`sudo rm -rf ${DEPLOY_ENV.WORKDIR}`, {
      ignoreError: true,
    })
  }
}

module.exports = new cleanup()
