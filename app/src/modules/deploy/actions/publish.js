const _deployAction = require('./_deployAction.js')
class publish extends _deployAction {
  constructor() {
    super()
    this.stage = 'publish'
  }

  async process() {
    if(this._shouldSkip(this.stage) === true) {
      logger(`跳過Publish階段`, 'yellow')
      return
    }

    this._outputStage(`Publish(${DEPLOY_ENV.DEPLOY_TYPE})`)

    const publishHandlers = {
      default: require('@modules/deploy/publishHandler/publishDefaultHandler'),
      vue: require('@modules/deploy/publishHandler/publishVueHandler'),
      laravel: require('@modules/deploy/publishHandler/publishLaravelHandler'),
    }

    let publishHandler = publishHandlers[DEPLOY_ENV.DEPLOY_TYPE]
    if(!publishHandler) {
      logger(`找不到相應的Publish Handler可以執行Publish流程`, 'red')
      process.exit()
      return
    }

    await publishHandler.publish()
  }
}

module.exports = new publish()
