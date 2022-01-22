const _basePublishHandler = require('./_basePublishHandler')
class publishNuxtHandler extends _basePublishHandler{
  async publish() {
    this.remoteNuxtPath = DEPLOY_ENV.CONFIG.rsync.path
    this.nuxtConfig = DEPLOY_ENV.CONFIG.nuxt
    this.nuxtTarget = this.nuxtConfig.target === 'server' ? 'server' : 'static'
    await this.publishMultiServer()
  }

  async _beforeRsync(serverIndex, server) {
    // remove remote dist directory
    if(DEPLOY_ENV.CONFIG.rsync.removeRemoteBeforeRsync === true) {
      await execOnServer(server, `sudo rm -rf ${DEPLOY_ENV.CONFIG.rsync.path}`, {
        ignoreError: true,
      })
    }
  }

  async _afterRsync(serverIndex, server) {
    await this._serverSideBuild(server)
  }

  async _serverSideBuild(server) {
    if(this.nuxtConfig.buildAtClient == true) return
    await execOnServer(server, `yarn install`, {
      ignoreError: true,
      remoteCwd: this.remoteNuxtPath,
    })

    if(this.nuxtTarget == 'server') {
      await execOnServer(server, `yarn build`, {
        ignoreError: true,
        remoteCwd: this.remoteNuxtPath,
      })
    }

    else {
      await execOnServer(server, `yarn generate`, {
        ignoreError: true,
        remoteCwd: this.remoteNuxtPath,
      })
    }
  }
}


module.exports = new publishNuxtHandler()
