const {Command, flags} = require('@oclif/command')

class install extends Command {
  async run() {
    const {flags} = this.parse(install)
    global.removeSudo = flags.removeSudo
    await execAsync(`sudo apt-get update`)
    try {
      await execAsync(`sudo add-apt-repository ppa:certbot/certbot -y`)
    } catch (error) {
      await execAsync(`sudo add-apt-repository ppa:certbot/certbot -r -y`)
    }
    await execAsync(`sudo apt-get update`)
    try {
      await execAsync(`sudo apt-get install python-certbot-nginx -y`)
    } catch (error) {
      await execAsync(`sudo apt-get install python3-certbot-nginx -y`)
    }
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
