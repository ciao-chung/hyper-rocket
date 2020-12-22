const { resolve } = require('path')
class _deployAction {
  _outputStage(message) {
    logger(`🔥 [DEPLOY INFO] ${message}`, 'blue')
  }

  _validateSingleHook(key) {
    const hookRelativePath = $helper.getRecursive(DEPLOY_ENV.CONFIG, key)
    if(!hookRelativePath) return true
    const hookPath = resolve(global.DEPLOY_ENV.CONFIG_DIR, hookRelativePath)
    const exist = existsSync(hookPath)
    if(!exist) return false
    try {
      const hook = require(hookPath)
      return typeof hook === 'function'
    } catch (error) {
      logger(error, 'yellow')
      return false
    }
    return false
  }

  async _callHook(key, variables = undefined) {
    const hookRelativePath = $helper.getRecursive(DEPLOY_ENV.CONFIG, key)
    if(!hookRelativePath) return
    const hookPath = resolve(global.DEPLOY_ENV.CONFIG_DIR, hookRelativePath)
    const exist = existsSync(hookPath)
    if(!exist) return

    let hook = async () => {}
    try {
      hook = require(hookPath)
    } catch (error) {
      logger(error, 'yellow')
    }
    this._outputStage(`Hook執行中: ${hookPath}`)
    await hook(variables)
  }

  async _executeCommands(commands, cwd) {
    if(!Array.isArray(commands)) return
    for(const command of commands) {
      const commandObject = this._getCommandObject(command)
      await execAsync(commandObject.script, {
        cwd,
        ignoreError: true,
      })
    }
  }

  async _executeServerCommands(server, commands) {
    if(!Array.isArray(commands)) return
    for(const command of commands) {
      const commandObject = this._getCommandObject(command)
      await execOnServer(server, commandObject.script, {
        remoteCwd: !commandObject.remoteCwd ? null : commandObject.remoteCwd,
      })
    }
  }

  _getCommandObject(command) {
    if(typeof command === 'string') {
      return {
        script: command,
      }
    }

    return command
  }

  async _rsync(server) {
    await execOnServer(server, `mkdir -p ${server.to}`)
    let script = `rsync -e "ssh -o StrictHostKeyChecking=no" -avzh ${server.from}/ ${server.user}@${server.host}:${server.to}`
    if(server.local) {
      script = `rsync -avzh ${server.from}/ ${server.to}`
    }
    await execAsync(script)
  }

  _shouldSkip(stage) {
    if(!global.deployOptions) return false
    const skip = global.deployOptions.skip
    if(!Array.isArray(skip)) return false
    return skip.includes(stage)
  }

  _validateDistPath() {
    if(existsSync(DEPLOY_ENV.DIST_PATH) === false) {
      logger(`PRODUCTION目錄不存在: ${DEPLOY_ENV.DIST_PATH}`, 'red')
      process.exit()
    }
  }

  _validServers() {
    const result = this._validServersResult()
    if(!result) {
      logger(`佈署設定的servers屬性設定不正確`, 'red')
      process.exit()
      return
    }
  }

  _validServersResult() {
    if(!DEPLOY_ENV) return false
    if(!DEPLOY_ENV.CONFIG) return false
    const servers = DEPLOY_ENV.CONFIG.servers
    if(!Array.isArray(servers)) return false
    if(servers.length == 0) return false
    return servers.every(server => {
      if(server.local === true) return true
      if(!server.user) return false
      if(!server.host) return false
      return true
    })
  }

  async _rsyncMeta(server, items) {
    if(!Array.isArray(items)) return
    if(items.length == 0) return
    this._outputStage(`正在rsync額外檔案或目錄`)
    for(const item of items) {
      if(!item.path) {
        logger(`沒有設定rsync meta item.path屬性`, 'yellow')
        continue
      }

      if(!item.to) {
        logger(`沒有設定rsync meta item.to屬性`, 'yellow')
        continue
      }

      try {
        await this._rsync({
          from: resolve(DEPLOY_ENV.CONFIG_DIR, item.path),
          to: item.to,
          local: server.local,
          host: server.host,
          user: server.user,
        })
      } catch (error) {
        logger(error, 'yellow')
      }
    }
  }
}

module.exports = _deployAction
