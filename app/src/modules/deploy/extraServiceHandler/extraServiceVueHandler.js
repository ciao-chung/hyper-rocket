const { resolve } = require('path')
const _baseExtraServiceHandler = require('./_baseExtraServiceHandler')
class extraServiceVueHandler extends _baseExtraServiceHandler{
  async _setupEachServerExtraService(index, server) {
    this.remoteVuePath = DEPLOY_ENV.CONFIG.rsync.path
    this.nuxtPm2Config = DEPLOY_ENV.CONFIG.nuxtPm2Config
    await this._restartNuxtJsServer(server)
  }

  async _restartNuxtJsServer(server) {
    if(!this.nuxtPm2Config) return
    this._outputStage(`開始啟動Nuxt.js Server`)
    const configFilePath = this.nuxtPm2Config.remoteConfigFilePath
    const appName = this.nuxtPm2Config.appName

    await execOnServer(server, `sudo pm2 delete ${appName}`, {
      ignoreError: true,
      remoteCwd: this.remoteVuePath,
    })

    await execOnServer(server, `sudo pm2 start ${configFilePath} --restart-delay=1000`, {
      ignoreError: true,
      remoteCwd: this.remoteVuePath,
    })

    await execOnServer(server, `sudo pm2 startup`, {
      ignoreError: true,
      remoteCwd: this.remoteVuePath,
    })

    await execOnServer(server, `sudo pm2 save`, {
      ignoreError: true,
      remoteCwd: this.remoteVuePath,
    })

    await execOnServer(server, `echo "sudo pm2 start ${configFilePath} --restart-delay=1000" > start-nuxt.sh`, {
      ignoreError: true,
      remoteCwd: this.remoteVuePath,
    })

    await execOnServer(server, `sudo chmod +x start-nuxt.sh`, {
      ignoreError: true,
      remoteCwd: this.remoteVuePath,
    })
  }
}


module.exports = new extraServiceVueHandler()
