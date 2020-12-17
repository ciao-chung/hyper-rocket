const { resolve } = require('path')
const _deployAction = require('../actions/_deployAction.js')
class _baseBuildHandler extends _deployAction {

  // 設定DEPLOY_ENV.DIST_PATH
  async setupDistPath() {
    // TODO
  }

  async _beforeBuild() {
    // TODO
  }

  async _startBuild() {
    // TODO
  }

  async _afterBuild() {
    // TODO
  }

  async build() {
    await this._callHook('build.beforeBuildHook')
    this._outputStage(`Before Build Command`)
    await this._executeCommands(
      DEPLOY_ENV.CONFIG.build.beforeBuildCommand,
      DEPLOY_ENV.SOURCE_PATH
    )
    this._outputStage(`Build ${DEPLOY_ENV.DEPLOY_LABEL}: ${DEPLOY_ENV.SOURCE_PATH}`)
    notify(`Build ${DEPLOY_ENV.DEPLOY_LABEL}`)

    await this._beforeBuild()
    await this._startBuild()
    await this._afterBuild()

    this._outputStage(`After Build Command`)
    await this._executeCommands(
      DEPLOY_ENV.CONFIG.build.afterBuildCommand,
      DEPLOY_ENV.SOURCE_PATH
    )
    await this._callHook('build.afterBuildHook')
    await this._callHook('build.afterBuildInitHook')
    this._outputStage(`Build ${DEPLOY_ENV.DEPLOY_LABEL}完成: ${DEPLOY_ENV.SOURCE_PATH}`)
    notify(`Build ${DEPLOY_ENV.DEPLOY_LABEL}完成`)
  }
}

module.exports = _baseBuildHandler
