const { resolve } = require('path')
const { existsSync, lstatSync } = require('fs')
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
    const deployCommitPath = resolve(DEPLOY_ENV.PROJECT_PATH, 'deploy.commit')

    const distPathIsDirectory = lstatSync(DEPLOY_ENV.PROJECT_PATH).isDirectory()
    if(distPathIsDirectory) {
      await execAsync(`cp ${deployCommitPath} ${DEPLOY_ENV.DIST_PATH}`, {
        cwd: DEPLOY_ENV.PROJECT_PATH,
      })
    }

    else {
      logger(`${deployCommitPath} 不是一個目錄, 跳過deploy.commit複製動作 ${deployCommitPath}`, 'yellow')
    }

    await this._callHook('build.beforeBuildHook')
    this._outputStage(`Before Build Command`)
    await this._executeCommands(
      DEPLOY_ENV.CONFIG.build.beforeBuildCommands,
      DEPLOY_ENV.SOURCE_PATH
    )
    this._outputStage(`Build ${DEPLOY_ENV.DEPLOY_LABEL}: ${DEPLOY_ENV.SOURCE_PATH}`)
    notify(`Build ${DEPLOY_ENV.DEPLOY_LABEL}`)

    await this._beforeBuild()
    await this._startBuild()
    await this._afterBuild()

    this._outputStage(`After Build Command`)
    await this._executeCommands(
      DEPLOY_ENV.CONFIG.build.afterBuildCommands,
      DEPLOY_ENV.SOURCE_PATH
    )
    await this._callHook('build.afterBuildHook')
    await this._callHook('build.afterBuildInitHook')
    this._outputStage(`Build ${DEPLOY_ENV.DEPLOY_LABEL}完成: ${DEPLOY_ENV.SOURCE_PATH}`)
    notify(`Build ${DEPLOY_ENV.DEPLOY_LABEL}完成`)
  }
}

module.exports = _baseBuildHandler
