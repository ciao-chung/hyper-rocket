const {Command, flags} = require('@oclif/command')

class install extends Command {
  async run() {
    const {flags} = this.parse(install)
    global.removeSudo = flags.removeSudo
    await execAsync(`sudo apt-get update`)
    await execAsync(`sudo apt-get install software-properties-common -y`)
    await execAsync(`sudo add-apt-repository ppa:certbot/certbot -y`)
    await execAsync(`sudo apt-get update`)
    await execAsync(`sudo apt-get install python-certbot-apache -y`)
    await execAsync(`sudo systemctl status certbot.timer`)
  }
}

install.description = `
安裝Certbot
`

install.flags = {
  removeSudo: global.removeSudoFlag(flags),
}

module.exports = install
