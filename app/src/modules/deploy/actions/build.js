const _deployAction = require('./_deployAction.js')
class build extends _deployAction {
  constructor() {
    super()
    this.stage = 'build'
  }

  async process() {
    this._outputStage(`Build Source(${DEPLOY_ENV.DEPLOY_TYPE})`)

    const buildHandlers = {
      default: require('@modules/deploy/buildHandler/buildDefaultHandler'),
      vue: require('@modules/deploy/buildHandler/buildVueHandler'),
      laravel: require('@modules/deploy/buildHandler/buildLaravelHandler'),
    }
    let buildHandler = buildHandlers[DEPLOY_ENV.DEPLOY_TYPE]
    if(!buildHandler) {
      logger(`找不到相應的Build Handler可以執行Build流程`, 'red')
      process.exit()
      return
    }

    this._outputStage(`工作目錄: ${DEPLOY_ENV.SOURCE_PATH}`)
    await buildHandler.setupDistPath()

    if(this._shouldSkip(this.stage) === true) {
      logger(`跳過Build階段`, 'yellow')
      return
    }
    await buildHandler.build()
  }
}

module.exports = new build()
