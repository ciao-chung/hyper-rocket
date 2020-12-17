const {Command, flags} = require('@oclif/command')

class localhost extends Command {
  async run() {
    const {flags} = this.parse(localhost)
    global.removeSudo = flags.removeSudo
    this.commandFlags = flags
    this.phpVersion = await getPhpVersion()

    const templatePath = this.commandFlags.spa === true
      ? 'nginx/localhost-spa.conf'
      : 'nginx/localhost-php.conf'
    const nginxConf = global.renderService.render(templatePath, {
      phpVersion: this.phpVersion,
      port: this.commandFlags.port,
      path: this.commandFlags.path,
    })

    const configPath = `/etc/nginx/sites-available/${this.commandFlags.filename}`
    logger(`正在建立Nginx設定檔: ${configPath}`, 'blue')
    await writeFileAsRoot(configPath, nginxConf)

    if(this.commandFlags.enabled) {
      await execAsync(`sudo rm -f /etc/nginx/sites-enabled/${this.commandFlags.filename}`)
      await execAsync(`sudo ln -s ${configPath} /etc/nginx/sites-enabled/${this.commandFlags.filename}`)
    }

    await execAsync(`sudo nginx -t`)
    await execAsync(`sudo service nginx restart`)
  }
}

localhost.description = `
設定Localhost Virtual Host`

localhost.flags = {
  filename: flags.string({
    required: true,
    char: 'f',
    description: `存在/etc/nginx/sites-available/中的檔名
例如: site.conf`,
  }),
  enabled: flags.boolean({ description: '直接啟用(預設為true)', default: true }),
  spa: flags.boolean({ description: 'Single Page Application', default: false }),
  port: flags.string({
    required: true,
    description: 'Port',
  }),
  path: flags.string({
    required: true,
    description: '網站路徑, 結尾請勿使用/符號',
  }),
  removeSudo: global.removeSudoFlag(flags),
}

module.exports = localhost
