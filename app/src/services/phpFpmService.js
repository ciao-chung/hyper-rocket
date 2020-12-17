class phpFpmService {
  constructor() {
    this.defaultConfig = {
      high: {
        max_children: 50,
        start_servers: 20,
        min_spare_servers: 10,
        max_requests: 500,
      },
      low: {
        max_children: 30,
        start_servers: 10,
        min_spare_servers: 5,
        max_requests: 300,
      },
    }
  }

  async setup(type, restart = false) {
    this.version = await global.getPhpVersion()
    this.config = this.defaultConfig[type]
    const wwwConf = global.renderService.render('php-fpm/www.conf', {
      phpVersion: this.version,
      ...this.config,
    })

    logger(`設定參數`, 'yellow')
    console.warn(this.config)

    await writeFileAsRoot(`/etc/php/${this.version}/fpm/pool.d/www.conf`, wwwConf)
    await execAsync(`sudo php-fpm${this.version} -t`)
    if(restart === true) {
      await execAsync(`sudo /usr/sbin/service php${this.version}-fpm restart`)
    }
  }
}

module.exports = new phpFpmService()
