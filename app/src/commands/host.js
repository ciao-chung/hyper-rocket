const {Command, flags} = require('@oclif/command')
const prettyjson = require('prettyjson')
const clipboardy = require('clipboardy')
const hostConfigService = require('@services/hostConfigService')
class Host extends Command {
  async run() {
    const { args, flags} = this.parse(Host)
    this.commandFlags = flags
    await this.readConfig()

    if(this.commandFlags.list === true) {
      await this.listHosts()
      return
    }

    await this.login()
  }

  async readConfig() {
    if(hostConfigService.hostConfigExist() === false) {
      await hostConfigService.createDefaultConfig()
    }

    this.config = hostConfigService.getHostConfig()
    if(!this.config) {
      logger(`設定檔格式錯誤: ${hostConfigService.getHostConfigFilePath()}`, 'red')
      logger(`請調整格式後再試一次`, 'red')
      process.exit()
    }
  }

  async listHosts() {
    logger('')
    logger('==========主機設定==========')
    console.log(prettyjson.render(this.config))
    logger('')
    process.exit()
  }

  async login() {
    const hostname = this.commandFlags.name
    const host = this.getHost(hostname)
    if(!host) {
      logger(`主機${hostname}不存在`, 'yellow')
      process.exit()
      return
    }

    const command = `ssh -o StrictHostKeyChecking=no ${host.user}@${host.host}`
    await clipboardy.writeSync(command)
    logger(`登入指令已複製到剪貼簿`)
    logger(command)
  }

  getHost(hostname) {
    if(!hostname) return null
    if(!Array.isArray(this.config.hosts)) return null
    return this.config.hosts.find(host => host.name === hostname)
  }
}

Host.description = `將遠端主機加上別名方便管理
將在主機設定檔將存在${chalk.hex(COLOR.ORANGE_HEX).bold('~/.hyper-rocket/host.yml')}中
`

Host.flags = {
  name: flags.string({
    char: 'n',
    description: '自訂的主機名稱',
    default: '',
  }),
  list: flags.boolean({
    char: 'l',
    description: '列出所有主機資訊',
  }),
}

module.exports = Host
