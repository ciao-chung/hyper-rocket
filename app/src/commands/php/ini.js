require('../../kernel.js')
const {Command, flags, args } = require('@oclif/command')

class ini extends Command {
  async run() {
    const { args, flags} = this.parse(ini)

    await execAsync(`php -i | grep "Loaded Configuration File"`)
  }

}

ini.description = `
找出作用中php.ini的位置`

module.exports = ini
