const { resolve } = require('path')
const _baseExtraServiceHandler = require('./_baseExtraServiceHandler')
class extraServiceNuxtHandler extends _baseExtraServiceHandler{
  async _setupEachServerExtraService(index, server) {
    this.remoteNuxtPath = DEPLOY_ENV.CONFIG.rsync.path
    this.nuxtPm2Config = DEPLOY_ENV.CONFIG.nuxtPm2Config
    this.nuxtConfig = DEPLOY_ENV.CONFIG.nuxt
    await this._restartNuxtJsServer(server)
  }

  async _restartNuxtJsServer(server) {
    if(!this.nuxtConfig) return
    if(!this.nuxtConfig.pm2AppName) {
      logger(`未設定nuxt.pm2AppName`, 'red')
      return
    }
    this._outputStage(`開始啟動Nuxt.js Server`)
    const configFilePath = resolve(this.remoteNuxtPath, `nuxt-pm2-config.yml`)

    await execOnServer(server, `sudo pm2 delete ${this.nuxtConfig.pm2AppName}`, {
      ignoreError: true,
      remoteCwd: this.remoteNuxtPath,
    })

    await execOnServer(server, `sudo pm2 start ${configFilePath} --restart-delay=1000`, {
      ignoreError: true,
      remoteCwd: this.remoteNuxtPath,
    })

    await execOnServer(server, `sudo pm2 startup`, {
      ignoreError: true,
      remoteCwd: this.remoteNuxtPath,
    })

    await execOnServer(server, `sudo pm2 save`, {
      ignoreError: true,
      remoteCwd: this.remoteNuxtPath,
    })

    await execOnServer(server, `echo "sudo pm2 start ${configFilePath} --restart-delay=1000" > start-nuxt.sh`, {
      ignoreError: true,
      remoteCwd: this.remoteNuxtPath,
    })

    await execOnServer(server, `sudo chmod +x start-nuxt.sh`, {
      ignoreError: true,
      remoteCwd: this.remoteNuxtPath,
    })
  }
}


module.exports = new extraServiceNuxtHandler()
