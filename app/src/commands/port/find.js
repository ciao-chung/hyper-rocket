require('../../kernel.js')
const {Command} = require('@oclif/command')

class KillProcessByPortCommand extends Command {
  async run() {
    const { args, flags } = this.parse(KillProcessByPortCommand)
    this.port = args.port
    global.removeSudo = flags.removeSudo
    const pid = await global.getPidByPort(this.port)
    if(!pid) {
      logger(`port ${this.port}找不到對應的Process`, 'red')
      return
    }
    await execAsync(`sudo lsof -i:${this.port}`)
    logger(`Process ID(PID): ${pid}`)
  }
}

KillProcessByPortCommand.description = `尋找指定port的process`

KillProcessByPortCommand.args = [
  {
    name: 'port',
    required: true,
    description: 'process port',
  }
]

module.exports = KillProcessByPortCommand
