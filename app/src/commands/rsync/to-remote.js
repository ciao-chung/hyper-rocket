const {Command, flags} = require('@oclif/command')

class toRemote extends Command {
  async run() {
    const {flags} = this.parse(toRemote)
    await execAsync(`rsync -e "ssh -o StrictHostKeyChecking=no" -avzh ${flags.from} ${flags.username}@${flags.host}:${flags.to}`)
  }
}

toRemote.description = `
透過Rsync從Local Host複製檔案或目錄到Remote Host
將執行指令:  rsync -e "ssh -o StrictHostKeyChecking=no" -avzh /local/path user@host:/remote/target
`

toRemote.flags = {
  username: flags.string({
    char: 'u',
    required: true,
    description: 'Remote Host帳號',
  }),
  host: flags.string({
    char: 'h',
    required: true,
    description: 'Remote Host',
  }),
  from: flags.string({
    char: 'f',
    required: true,
    description: 'Local Host目錄或檔案',
  }),
  to: flags.string({
    char: 't',
    required: true,
    description: 'Remote目錄或檔案',
  }),
}

module.exports = toRemote
