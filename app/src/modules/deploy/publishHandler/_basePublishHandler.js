const { resolve } = require('path')
const _deployAction = require('../actions/_deployAction.js')
const cronJobService = require('@services/cronJobService.js')
class _basePublishHandler extends _deployAction{

  // 可實做此method在每一台server rsync之前做一些事情
  async _beforeRsync(serverIndex, server) {
    // TODO
  }

  // 可實做此method在每一台server rsync之後做一些事情
  async _afterRsync(serverIndex, server) {
    // TODO
  }

  async publishMultiServer() {
    this._validateDistPath()
    this._validServers()

    // rsync to each server
    for (const index in DEPLOY_ENV.CONFIG.servers) {
      const server = DEPLOY_ENV.CONFIG.servers[index]
      const no = parseInt(index)+1
      try {
        await this._rsyncEachServer(index, server)
        const notification = `第${no}台Server發佈完成`
        this._outputStage(notification)
        notify(notification)
      } catch (error) {
        const notification = `第${no}台Server發佈中斷`
        this._outputStage(notification)
        logger(error, 'red')
        notify(notification)
      }
    }

    // hook
    await this._callHook('rsync.beforeRsyncHook')

    // commands
    await this._executeCommands(
      DEPLOY_ENV.CONFIG.rsync.beforeRsyncCommands,
      DEPLOY_ENV.SOURCE_PATH
    )

    // hook
    await this._callHook('rsync.afterRsyncHook')

    // commands
    await this._executeCommands(
      DEPLOY_ENV.CONFIG.rsync.afterRsyncCommands,
      DEPLOY_ENV.SOURCE_PATH
    )
  }

  async _rsyncEachServer(serverIndex, server) {
    // hook
    await this._callHook('rsync.beforeRsyncEchoServer', {
      serverIndex,
      server, // 佈署YAML設定server物件
    })

    await this._rsyncMeta(server, DEPLOY_ENV.CONFIG.rsync.meta)

    await this._beforeRsync(serverIndex, server)

    // execute remote command
    await this._executeServerCommands(
      server,
      DEPLOY_ENV.CONFIG.rsync.beforeRsyncServerCommands,
      { cwd: DEPLOY_ENV.DIST_PATH },
    )

    // rsync
    logger(`DEPLOY_ENV.DIST_PATH: ${DEPLOY_ENV.DIST_PATH}`)
    await this._rsync({
      tar: DEPLOY_ENV.CONFIG.rsync.tar == true,
      from: DEPLOY_ENV.DIST_PATH,
      to: DEPLOY_ENV.CONFIG.rsync.path,
      local: server.local,
      host: server.host,
      user: server.user,
    })

    await this._afterRsync(serverIndex, server)

    // execute remote command
    await this._executeServerCommands(
      server,
      DEPLOY_ENV.CONFIG.rsync.afterRsyncServerCommands,
      { cwd: DEPLOY_ENV.DIST_PATH },
    )

    // hook
    await this._callHook('rsync.afterRsyncEchoServer', {
      serverIndex,
      server, // 佈署YAML設定server物件
    })

    await cronJobService.setup(server, DEPLOY_ENV.CONFIG.cron)
  }
}


module.exports = _basePublishHandler
