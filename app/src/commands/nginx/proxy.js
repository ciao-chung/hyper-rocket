const {Command, flags} = require('@oclif/command')

class proxy extends Command {
  async run() {
    const {flags} = this.parse(proxy)
    global.removeSudo = flags.removeSudo
    this.commandFlags = flags

    const templatePath = '/nginx/site-proxy.conf'
    this.templateData = {
      proxyPort: this.commandFlags.proxyPort,
      host: this.commandFlags.host,
      port: this.commandFlags.port,
      path: this.commandFlags.path,
      domain: this.commandFlags.domain,
    }
    const nginxConf = global.renderService.render(templatePath, this.templateData)

    const configPath = `/etc/nginx/sites-available/${this.commandFlags.filename}`
    logger(`正在建立Nginx設定檔: ${configPath}`, 'blue')
    await writeFileAsRoot(configPath, nginxConf)

    if(this.commandFlags.enabled) {
      await execAsync(`sudo rm -f /etc/nginx/sites-enabled/${this.commandFlags.filename}`)
      await execAsync(`sudo ln -s ${configPath} /etc/nginx/sites-enabled/${this.commandFlags.filename}`)
    }

    // 有SSL的情況
    if(this.commandFlags.ssl === true) {
      this.email = this.commandFlags.email
      if(!this.email) {
        logger(`缺少email參數無法使用certbot設定SSL憑證`, 'red')
        return
      }
      await execAsync(`sudo certbot --nginx --redirect --keep-until-expiring --no-eff-email --agree-tos --email ${this.email} --domains ${this.commandFlags.domain}`)
      await this._createSslNginxConfig()
    }

    await execAsync(`sudo nginx -t`)
    await execAsync(`sudo service nginx restart`)
  }

  async _createSslNginxConfig() {
    let nginxConfigTemplate = '/nginx/site-proxy-ssl.conf'

    if(!nginxConfigTemplate) {
      logger(`找不到符合的nginx設定樣板`, 'yellow')
      return
    }
    const nginxConf = global.renderService.render(nginxConfigTemplate, this.templateData)
    const configPath = `/etc/nginx/sites-available/${this.commandFlags.filename}`
    logger(`正在建立Nginx設定檔: ${configPath}`, 'blue')
    await writeFileAsRoot(configPath, nginxConf)
  }
}

proxy.description = `
設定Proxy Virtual Host
一般用於直接將網域的web 80 port轉向內部的服務指定port
像是聊天室、SSR服務等
`

proxy.flags = {
  filename: flags.string({
    required: true,
    char: 'f',
    description: `存在/etc/nginx/sites-available/中的檔名
例如: site.conf`,
  }),
  enabled: flags.boolean({ description: '直接啟用(預設為true)', default: true }),
  ssl: flags.boolean({ description: '使用SSL', default: false }),
  domain: flags.string({
    required: true,
    description: '網域, 如果是本機請使用localhost',
  }),
  proxyPort: flags.string({
    description: '轉接的Port(預設為80)',
    default: 80,
  }),
  port: flags.string({
    required: true,
    description: '內部Proxy Port',
  }),
  host: flags.string({
    description: 'host名稱, 預設為http://127.0.0.1',
    default: 'http://127.0.0.1',
  }),
  email: flags.string({
    description: 'Let\'s encrypt email',
  }),
  removeSudo: global.removeSudoFlag(flags),
}

module.exports = proxy
