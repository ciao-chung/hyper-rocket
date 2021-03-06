const {Command, flags} = require('@oclif/command')

class site extends Command {
  async run() {
    const {flags} = this.parse(site)
    global.removeSudo = flags.removeSudo
    this.commandFlags = flags
    this.phpVersion = await getPhpVersion()
    this.templateData = {
      phpVersion: this.phpVersion,
      port: this.commandFlags.port,
      path: this.commandFlags.path,
      domain: this.commandFlags.domain,
    }

    // 先設定HTTP版本
    let baseHttpNginxConfigTemplate = this._getBaseHttpNginxTemplate()

    if(!baseHttpNginxConfigTemplate) {
      logger(`找不到符合的nginx設定樣板`, 'yellow')
      return
    }
    const nginxConf = global.renderService.render(baseHttpNginxConfigTemplate, this.templateData)

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
    let nginxConfigTemplate = this._getSslNginxTemplate()

    if(!nginxConfigTemplate) {
      logger(`找不到符合的nginx設定樣板`, 'yellow')
      return
    }
    const nginxConf = global.renderService.render(nginxConfigTemplate, this.templateData)
    const configPath = `/etc/nginx/sites-available/${this.commandFlags.filename}`
    logger(`正在建立Nginx設定檔: ${configPath}`, 'blue')
    await writeFileAsRoot(configPath, nginxConf)
  }

  _getBaseHttpNginxTemplate() {
    if(this.commandFlags.spa === true) return 'nginx/site-spa.conf'
    return 'nginx/site-php.conf'
  }

  _getSslNginxTemplate() {
    if(this.commandFlags.spa === true) return 'nginx/site-spa-ssl.conf'
    return 'nginx/site-php-ssl.conf'
  }
}

site.description = `
設定網站Virtual Host`

site.flags = {
  filename: flags.string({
    required: true,
    char: 'f',
    description: `存在/etc/nginx/sites-available/中的檔名
例如: site.conf`,
  }),
  enabled: flags.boolean({ description: '直接啟用(預設為true)', default: true }),
  spa: flags.boolean({ description: 'Single Page Application', default: false }),
  ssl: flags.boolean({ description: '使用SSL', default: false }),
  port: flags.string({
    description: 'Port(預設為80)',
    default: 80,
  }),
  domain: flags.string({
    required: true,
    description: '網域',
  }),
  email: flags.string({
    description: 'Let\'s encrypt email',
  }),
  path: flags.string({
    required: true,
    description: '網站路徑, 結尾請勿使用/符號',
  }),
  removeSudo: global.removeSudoFlag(flags),
}

module.exports = site
