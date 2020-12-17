require('../kernel.js')
const {Command, flags, args } = require('@oclif/command')

class ToolsCommand extends Command {
  async run() {
    const { args, flags} = this.parse(ToolsCommand)
    this.version = args.version
    global.removeSudo = flags.removeSudo

    await execAsync(`sudo apt-get update`)

    if(flags.all === true || flags.snap) {
      await execAsync(`sudo apt-get install snapd -y`)
    }

    if(flags.all === true || flags.vim) {
      await execAsync(`sudo apt-get install vim -y`)
    }

    if(flags.all === true || flags.git) {
      await execAsync(`git config --global core.editor vim`)
      await execAsync(`sudo apt-get install git -y`)
    }

    if(flags.all === true || flags.curl) {
      await execAsync(`sudo apt-get install curl -y`)
    }

    if(flags.all === true || flags.xclip) {
      await execAsync(`sudo apt-get install xclip -y`)
    }

    if(flags.all === true || flags.htop) {
      await execAsync(`sudo apt-get install htop -y`)
    }

    logger(`工具安裝完成`)
  }
}

ToolsCommand.description = `安裝常用工具
可透過選項安裝指定工具
或是使用all選項一安裝全部工具
`

ToolsCommand.flags = {
  all: flags.boolean({ description: '一次安裝全部工具', default: false }),
  snap: flags.boolean({ default: false }),
  vim: flags.boolean({ default: false }),
  git: flags.boolean({ default: false }),
  tig: flags.boolean({ default: false }),
  curl: flags.boolean({ default: false }),
  xclip: flags.boolean({ default: false }),
  htop: flags.boolean({ default: false }),
  removeSudo: global.removeSudoFlag(flags),
}

module.exports = ToolsCommand
