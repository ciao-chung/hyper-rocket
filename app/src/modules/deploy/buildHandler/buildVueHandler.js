const { resolve } = require('path')
const { existsSync } = require('fs')
const _baseBuildHandler = require('./_baseBuildHandler')
class buildVueHandler extends _baseBuildHandler {
  async setupDistPath() {
    const distDir = !DEPLOY_ENV.CONFIG.build.distDir
      ? 'dist'
      : DEPLOY_ENV.CONFIG.build.distDir
    this.vuePublicFolderPath = !DEPLOY_ENV.CONFIG.build.vuePublicFolderPath
      ? 'public'
      : DEPLOY_ENV.CONFIG.build.vuePublicFolderPath
    DEPLOY_ENV.DIST_PATH = resolve(DEPLOY_ENV.SOURCE_PATH, distDir)
  }

  async _beforeBuild() {
    await this._removeNodeModules()
  }

  async _startBuild() {
    await this._addDeployCommit()
    await this._setupNuxtPm2Config()
    await this._yarnInstall()
    await this._setupApiBase()
    await this._setupEnvFile()
    await this._buildWebpack()
  }

  async _addDeployCommit() {
    const deployCommitFilePath = resolve(DEPLOY_ENV.PROJECT_PATH, 'deploy.commit')
    if(existsSync(deployCommitFilePath) === false) {
      logger(`找不到deploy.commit檔案(${deployCommitFilePath})`, 'yellow')
      return
    }

    try {
      await execAsync(`cp ${deployCommitFilePath} ${this.vuePublicFolderPath}`, {
        cwd: DEPLOY_ENV.SOURCE_PATH,
      })
    } catch (error) {
      logger(error, 'red')
      logger(`deploy.commit檔案複製失敗`, 'yellow')
    }
  }

  async _setupNuxtPm2Config() {
    const nuxtPm2Config = DEPLOY_ENV.CONFIG.nuxtPm2Config
    if(!nuxtPm2Config) return
    const configFilePath = resolve(DEPLOY_ENV.SOURCE_PATH, nuxtPm2Config.configFile)

    if(existsSync(configFilePath) === false) {
      logger(`找不到nuxt.js pm2設定檔(${configFilePath})`, 'yellow')
      return
    }

    const variable = typeof nuxtPm2Config.variable != 'object' ? {} : nuxtPm2Config.variable
    const yamlFileContent = global.renderService.render(configFilePath, variable, {
      absolutePath: true,
    })
    await writeFile(configFilePath, yamlFileContent)
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
