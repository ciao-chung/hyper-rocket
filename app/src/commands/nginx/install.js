const {Command, flags} = require('@oclif/command')

class install extends Command {
  async run() {
    const {flags} = this.parse(install)
    global.removeSudo = flags.removeSudo
    this.commandFlags = flags

    if(this.commandFlags.skipInstall != true) {
      await this._installNginx()
    }
    await this._setupNginxConf()
    await this._setupDefaultConf()
    await execAsync(`sudo nginx -t`)
    await execAsync(`sudo service nginx restart`)
  }

  async _installNginx() {
    await execAsync(`sudo apt-get install nginx -y`)
    try {
      await execAsync(`sudo apt-add-repository -y ppa:hda-me/nginx-stable -y`)
    } catch {
      await execAsync(`sudo apt-add-repository -y ppa:hda-me/nginx-stable -r -y`)
    }
    await execAsync(`sudo apt-get update -y`)

    if(this.commandFlags.brotli === true) {
      await execAsync(`sudo apt-get install nginx-module-brotli -y`, {
        ignoreError: true,
      })
    }

    await execAsync(`sudo rm -f /etc/nginx/sites-available/default.conf`, {
      ignoreError: true,
    })
    if(this.commandFlags.certbot) {
      await execAsync(`sudo add-apt-repository ppa:certbot/certbot -y`)
      await execAsync(`sudo apt-get update -y`)
      await execAsync(`sudo apt-get install python-certbot-nginx -y`)
    }

    try {
      await execAsync(`sudo service nginx restart`)
    } catch (error) {
      logger('nginx server重啟失敗, 確認是否安裝nginx', 'yellow')
    }
  }

  async _setupNginxConf() {
    let nginxConf = global.renderService.render('nginx/nginx.conf')
    if(this.commandFlags.brotli === true) {
      nginxConf = global.renderService.render('nginx/nginx-brotli.conf')
    }
    await writeFileAsRoot('/etc/nginx/nginx.conf', nginxConf)

    const indexHtml = global.renderService.render('nginx/index.html')
    await writeFileAsRoot('/var/www/html/index.html', indexHtml)
    await execAsync(`sudo rm -f /var/www/html/index.nginx-debian.html`, {
      ignoreError: true,
    })
  }

  async _setupDefaultConf() {
    let content = null
    if(this.commandFlags.phpfpm) {
      content = global.renderService.render('nginx/default-phpfpm.conf', {
        phpVersion: this.commandFlags.phpfpm,
      })
    }

    else {
      content = global.renderService.render('nginx/default.conf')
    }

    await writeFileAsRoot('/etc/nginx/sites-available/default', content)
  }
}

install.description = `
安裝Nginx Proxy Server`

install.flags = {
  skipInstall: flags.boolean({
    description: '跳過nginx安裝',
    default: false,
  }),
  brotli: flags.boolean({
    description: '安裝nginx-module-brotli壓縮套件',
    default: false,
  }),
  certbot: flags.boolean({
    description: '安裝Certbot',
    default: false,
  }),
  phpfpm: flags.string({
    description: '設定php-fpm指定版本',
    options: ['7.1', '7.2', '7.3', '7.4', '8.0', '8.1'],
  }),
  removeSudo: global.removeSudoFlag(flags),
}

module.exports = install
