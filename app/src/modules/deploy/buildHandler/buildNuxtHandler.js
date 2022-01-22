const { resolve } = require('path')
const { existsSync } = require('fs')
const _baseBuildHandler = require('./_baseBuildHandler')
class buildNuxtHandler extends _baseBuildHandler {
  async setupDistPath() {
    this.remoteNuxtPath = DEPLOY_ENV.CONFIG.rsync.path
    const distDir = !DEPLOY_ENV.CONFIG.build.distDir
      ? 'dist'
      : DEPLOY_ENV.CONFIG.build.distDir
    this.publicFolderPath = !DEPLOY_ENV.CONFIG.build.publicFolderPath
      ? 'static'
      : DEPLOY_ENV.CONFIG.build.publicFolderPath

    this.nuxtConfig = DEPLOY_ENV.CONFIG.nuxt
    this.nuxtTarget = this.nuxtConfig.target === 'server' ? 'server' : 'static'

    DEPLOY_ENV.DIST_PATH = DEPLOY_ENV.SOURCE_PATH

    logger(`Nuxt Target: ${this.nuxtTarget}`, 'red')
  }

  async _beforeBuild() {
    await this._removeNodeModules()
  }

  async _startBuild() {
    await this._addDeployCommit()
    if(!this.nuxtConfig) {
      logger(`佈署設定YAML無nuxt設定無法佈署`, 'red')
      return
    }

    await this._setupNuxtPm2Config()
    await this._setupEnvFile()
    await this._clientSideBuild()
  }

  async _addDeployCommit() {
    const deployCommitFilePath = resolve(DEPLOY_ENV.PROJECT_PATH, 'deploy.commit')
    if(existsSync(deployCommitFilePath) === false) {
      logger(`找不到deploy.commit檔案(${deployCommitFilePath})`, 'yellow')
      return
    }

    const deployCommitPath = this.nuxtTarget === 'server'
      ? DEPLOY_ENV.SOURCE_PATH
      : this.publicFolderPath

    try {
      await execAsync(`cp ${deployCommitFilePath} ${deployCommitPath}`, {
        cwd: DEPLOY_ENV.SOURCE_PATH,
      })
    } catch (error) {
      logger(error, 'red')
      logger(`deploy.commit檔案複製失敗`, 'yellow')
    }
  }

  // 在client端nuxt目錄建立pm2設定
  async _setupNuxtPm2Config() {
    if(!this.nuxtConfig) return
    if(!this.nuxtConfig.pm2AppName) {
      logger(`未設定nuxt.pm2AppName無法設定pm2 config yaml`, 'red')
      return
    }
    const nuxtPm2ConfigPath = resolve(DEPLOY_ENV.SOURCE_PATH, `nuxt-pm2-config.yml`)
    const nuxtPm2Config = global.renderService.render('/nuxt/pm2-config.yml', {
      pm2ProcessName: this.nuxtConfig.pm2AppName,
      cwd: this.remoteNuxtPath,
      port: this.nuxtConfig.port || '8888',
    })
    await writeFile(nuxtPm2ConfigPath, nuxtPm2Config)
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

  async _clientSideBuild() {
    if(!this.nuxtConfig.buildAtClient) return

    await execAsync(`yarn install`, {
      cwd: DEPLOY_ENV.SOURCE_PATH,
    })

    if(this.nuxtTarget == 'server') {
      await execAsync(`yarn build`, {
        cwd: DEPLOY_ENV.SOURCE_PATH,
      })
    }

    else {
      await execAsync(`yarn generate`, {
        cwd: DEPLOY_ENV.SOURCE_PATH,
      })
    }
  }

  async _removeNodeModules() {
    await execAsync(`rm -rf node_modules`, {
      cwd: DEPLOY_ENV.SOURCE_PATH,
    })
  }

}

module.exports = new buildNuxtHandler()
