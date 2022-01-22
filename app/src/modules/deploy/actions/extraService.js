const _deployAction = require('./_deployAction.js')
class extraService extends _deployAction {
  constructor() {
    super()
    this.stage = 'extra-service'
  }

  async process() {
    if(this._shouldSkip(this.stage) === true) {
      logger(`跳過Extra Service階段`, 'yellow')
      return
    }

    this._outputStage(`Extra Service(${DEPLOY_ENV.DEPLOY_TYPE})`)

    const extraServiceHandlers = {
      default: require('@modules/deploy/extraServiceHandler/extraServiceDefaultHandler'),
      vue: require('@modules/deploy/extraServiceHandler/extraServiceVueHandler'),
      nuxt: require('@modules/deploy/extraServiceHandler/extraServiceNuxtHandler'),
      laravel: require('@modules/deploy/extraServiceHandler/extraServiceLaravelHandler'),
    }

    let extraServiceHandler = extraServiceHandlers[DEPLOY_ENV.DEPLOY_TYPE]
    if(!extraServiceHandler) {
      logger(`找不到相應的Extra Service Handler可以執行Extra Service流程`, 'red')
      process.exit()
      return
    }

    await extraServiceHandler.process()
  }
}

module.exports = new extraService()
