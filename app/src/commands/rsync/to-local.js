const {Command, flags} = require('@oclif/command')

class toLocal extends Command {
  async run() {
    const {flags} = this.parse(toLocal)
    await execAsync(`rsync -chavzP --stats ${flags.username}@${flags.host}:${flags.from} ${flags.to}`)
  }
}

toLocal.description = `
透過Rsync從Remote Host複製檔案或目錄到Local Host
將執行指令: rsync -chavzP --stats user@host:/remote/target /local/path
`

toLocal.flags = {
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
    description: 'Remote Host目錄或檔案',
  }),
  to: flags.string({
    char: 't',
    required: true,
    description: 'Local Host目錄或檔案',
  }),
}

module.exports = toLocal
