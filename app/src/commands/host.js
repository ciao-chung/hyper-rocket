const {Command, flags} = require('@oclif/command')
const cli = require('cli-ux')
const clipboardy = require('clipboardy')
const hostConfigService = require('@services/hostConfigService')
const inquirer = require('inquirer')
class Host extends Command {
  async run() {
    const { args, flags} = this.parse(Host)
    this.hostname = args.name
    this.commandFlags = flags
    await this.readConfig()

    if(!this.hostname) {
      await this.choiceHost()
    }

    if(this.commandFlags.list === true) {
      await this.listHosts()
      return
    }

    await this.login()
  }

  async choiceHost() {
    const options = this.config.hosts.map(host => {
      let name = host.name
      if(host.description) name += ` (${host.description})`
      return {
        name,
        value: host.name,
      }
    })
    const { hostname } = await inquirer.prompt([
      {
        type: 'list',
        name: 'hostname',
        message: '請選擇主機',
        choices: options,
        loop: false,
        pageSize: 30,
      }
    ])

    this.hostname = hostname
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
    const columns = {
      name: {
        header: '主機',
        minWidth: 30,
        get: row => chalk.hex(COLOR.BLUE_HEX).bold(row.name),
      },
      description: {
        header: '說明',
        minWidth: 30,
        get: row => row.description || '',
      },
    }
    const options = {

    }

    cli.ux.table(this.config.hosts, columns, options)
    process.exit()
  }

  async login() {
    const hostname = this.hostname
    const host = this.getHost(hostname)
    if(!host) {
      logger(`主機${hostname}不存在`, 'yellow')
      process.exit()
      return
    }

    const command = `ssh -o StrictHostKeyChecking=no ${host.user}@${host.host}`
    await clipboardy.writeSync(command)
    notify(`登入指令已複製到剪貼簿`)
    logger(`登入指令已複製到剪貼簿`)
    logger(command)
  }

  getHost(hostname) {
    if(!hostname) return null
    if(!Array.isArray(this.config.hosts)) return null
    return this.config.hosts.find(host => host.name === hostname)
  }
}

Host.description = `快速登入遠端主機
不需記任何主機資訊
透過命名遠端主機
將在主機設定檔將存在 ${chalk.hex(COLOR.ORANGE_HEX).bold('~/.hyper-rocket/host.yml')} 中
`

Host.args = [{
  name: 'name',
  description: '自訂的主機名稱',
  default: '',
}]

Host.flags = {
  // name: flags.string({
  //   char: 'n',
  //   description: '自訂的主機名稱',
  //   default: '',
  // }),
  list: flags.boolean({
    char: 'l',
    description: '列出所有主機資訊',
  }),
}

module.exports = Host
