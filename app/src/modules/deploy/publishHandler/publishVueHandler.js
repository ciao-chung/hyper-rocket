const _basePublishHandler = require('./_basePublishHandler')
class publishVueHandler extends _basePublishHandler{
  async publish() {
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
}


module.exports = new publishVueHandler()
