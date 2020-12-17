const { resolve } = require('path')
const _baseBuildHandler = require('./_baseBuildHandler')
class buildDefaultHandler extends _baseBuildHandler {
  async setupDistPath() {
    const distDir = !DEPLOY_ENV.CONFIG.build.distDir
      ? '.'
      : DEPLOY_ENV.CONFIG.build.distDir
    DEPLOY_ENV.DIST_PATH = resolve(DEPLOY_ENV.SOURCE_PATH, distDir)
  }

  async _beforeBuild() {

  }

  async _startBuild() {

  }
}

module.exports = new buildDefaultHandler()
