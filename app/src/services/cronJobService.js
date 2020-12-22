const { resolve, join } = require('path')
class cronJobService {
  async setup(server, config) {
    if(!server) return
    if(!config) return
    if(!config.enable) return
    if(!this._configValid(config)) {
      logger('CronJob設定不正確', 'red')
      console.warn(config)
      return
    }

    // 只佈署在指定server tag的情況
    if(config.onServerTag && config.onServerTag != server.tag) {
      return
    }

    this.server = server
    this.config = config
    this.name = config.name
    this.user = config.user
    this.rules = config.rules
    this.cronJobFilePath = resolve(`/etc/cron.d`, this.name)
    logger(`正在設定CronJob檔案: ${this.cronJobFilePath}`, 'green')
    logger(this._getCronFileContent(), 'yellow')
    await execOnServer(this.server, `sudo rm -rf ${this.cronJobFilePath}`)
    await execOnServer(this.server, `sudo bash -c 'echo "${this._getCronFileContent()}" > ${this.cronJobFilePath}'`)
    await execOnServer(this.server, `sudo chown ${this.user}:${this.user} ${this.cronJobFilePath}`)
    await execOnServer(this.server, `sudo chmod g-w ${this.cronJobFilePath}`)
    await execOnServer(this.server, `sudo service cron restart`)
  }

  _configValid(config) {
    if(!config.name) return false
    if(!config.user) return false
    if(!Array.isArray(config.rules)) return false
    return true
  }

  _getCronFileContent() {
    let result = ''
    if(typeof this.config.comment === 'string') {
      result += `# ${this.config.comment}\n`
    }

    for(const rule of this.rules) {
      result += `${rule} \n`
    }
    return result
  }
}

module.exports = new cronJobService()
