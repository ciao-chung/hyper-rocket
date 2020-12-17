const {Command, flags} = require('@oclif/command')
class InstallClient extends Command {
  async run() {
    const {args, flags} = this.parse(InstallClient)
    global.removeSudo = flags.removeSudo
    await execAsync(`sudo apt-get install -y mysql-client`)
  }
}

InstallClient.description = `
安裝MySQL Client`

InstallClient.flags = {
  removeSudo: global.removeSudoFlag(flags),
}

module.exports = InstallClient
