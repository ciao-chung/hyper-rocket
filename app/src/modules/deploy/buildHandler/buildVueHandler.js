const { resolve } = require('path')
const _baseBuildHandler = require('./_baseBuildHandler')
class buildVueHandler extends _baseBuildHandler {
  async setupDistPath() {
    const distDir = !DEPLOY_ENV.CONFIG.build.distDir
      ? 'dist'
      : DEPLOY_ENV.CONFIG.build.distDir
    DEPLOY_ENV.DIST_PATH = resolve(DEPLOY_ENV.SOURCE_PATH, distDir)
  }

  async _beforeBuild() {
    await this._removeNodeModules()
  }

  async _startBuild() {
    await this._yarnInstall()
    await this._setupApiBase()
    await this._setupEnvFile()
    await this._buildWebpack()
  }

  async _yarnInstall() {
    await execAsync(`yarn install`, {
      cwd: DEPLOY_ENV.SOURCE_PATH,
    })
  }

  async _setupApiBase() {
    const apibase = DEPLOY_ENV.CONFIG.build.apibase
    if(!apibase) return
    const apibasePath = !DEPLOY_ENV.CONFIG.build.apibasePath
      ? 'src/config'
      : DEPLOY_ENV.CONFIG.build.apibasePath
    await execAsync(`mkdir -p ${apibasePath}`, {
      cwd: DEPLOY_ENV.SOURCE_PATH,
    })

    await execAsync(`echo '{ "apibase": "${apibase}" }' > ${apibasePath}/apibase.json`, {
      cwd: DEPLOY_ENV.SOURCE_PATH,
    })
  }

  async _setupEnvFile() {
    const frontendEnv = DEPLOY_ENV.CONFIG.build.env
    if(typeof frontendEnv != 'object') return
    const envFileContent = JSON.stringify(frontendEnv)
    await execAsync(`mkdir -p src/config`, {
      cwd: DEPLOY_ENV.SOURCE_PATH,
    })
    await execAsync(`echo '${envFileContent}' > src/config/env.json`, {
      cwd: DEPLOY_ENV.SOURCE_PATH,
    })
  }

  async _buildWebpack() {
    const buildScript = !DEPLOY_ENV.CONFIG.build.buildScript
      ? 'yarn build'
      : DEPLOY_ENV.CONFIG.build.buildScript

    await execAsync(buildScript, {
      cwd: DEPLOY_ENV.SOURCE_PATH,
    })
  }

  async _removeNodeModules() {
    await execAsync(`rm -rf node_modules`, {
      cwd: DEPLOY_ENV.SOURCE_PATH,
    })
  }

}

module.exports = new buildVueHandler()
