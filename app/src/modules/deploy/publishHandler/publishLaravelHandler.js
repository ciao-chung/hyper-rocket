const _basePublishHandler = require('./_basePublishHandler')
class publishLaravelHandler extends _basePublishHandler{
  async publish() {
    this.remoteLaravelPath = DEPLOY_ENV.CONFIG.rsync.path
    await this.publishMultiServer()
  }

  async _beforeRsync(serverIndex, server) {
    // remove remote dist directory
    if(DEPLOY_ENV.CONFIG.rsync.removeRemoteVendorBeforeRsync === true && !this._shouldSkip('rsync')) {
      await execOnServer(server, `sudo rm -rf ${this.remoteLaravelPath}/vendor`, {
        ignoreError: true,
      })
    }
  }

  async _afterRsync(serverIndex, server) {
    const no = parseInt(serverIndex)+1
    this._outputStage(`第${no}台Server正在設定Laravel目錄的檔案權限`)
    await this._setupDirectoriesPermission(server)
    await this._cleanCache(server)
    await this._migrate(server)
  }

  async _setupDirectoriesPermission(server) {
    await execOnServer(server, `php artisan storage:link`, {
      ignoreError: true,
      remoteCwd: this.remoteLaravelPath,
    })

    await execOnServer(server, `sudo chmod 775 -R ${this.remoteLaravelPath}`, {
      ignoreError: true,
      remoteCwd: this.remoteLaravelPath,
    })

    await execOnServer(server, `sudo chmod o+w -R ${this.remoteLaravelPath}/storage`, {
      ignoreError: true,
      remoteCwd: this.remoteLaravelPath,
    })
  }

  async _cleanCache(server) {
    await execOnServer(server, `php artisan optimize:clear`, {
      ignoreError: true,
      remoteCwd: this.remoteLaravelPath,
    })

    await execOnServer(server, `php artisan optimize`, {
      ignoreError: true,
      remoteCwd: this.remoteLaravelPath,
    })

    await execOnServer(server, `php artisan config:clear`, {
      ignoreError: true,
      remoteCwd: this.remoteLaravelPath,
    })

    await execOnServer(server, `php artisan cache:clear`, {
      ignoreError: true,
      remoteCwd: this.remoteLaravelPath,
    })
  }

  async _migrate(server) {
    if(global.deployOptions.migrate != true) return
    await execOnServer(server, `php artisan migrate`, {
      ignoreError: true,
      remoteCwd: this.remoteLaravelPath,
    })
  }
}


module.exports = new publishLaravelHandler()
