const {Command, flags} = require('@oclif/command')

class createRootUser extends Command {
  async run() {
    const {flags, args} = this.parse(createRootUser)
    global.removeSudo = flags.removeSudo
    this.commandFlags = flags
    this.username = args.username

    logger(`開始建立使用者帳號: ${this.username}`)
    try {
      await execAsync(`sudo adduser --ingroup root --gecos "" --disabled-password --quiet --home /home/${this.username} ${this.username}`)
      await execAsync(`sudo sh -c 'echo "${this.username} ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers'`)
    } catch (error) {
      logger(`使用者帳號${this.username}已經存在`, 'yellow')
    }
    await execAsync(`sudo mkdir -p /home/${this.username}/.ssh`)
    await execAsync(`sudo touch /home/${this.username}/.ssh/authorized_keys`)
    await execAsync(`sudo chown ${this.username} /home/${this.username}/.ssh/authorized_keys`)
    await execAsync(`sudo chown -R ${this.username} /home/${this.username}/.ssh`)
  }
}

createRootUser.description = `
建立有root權限的使用者
`

createRootUser.args = [
  {
    name: 'username',
    required: true,
    description: '使用者名稱',
  },
]


createRootUser.flags = {
  removeSudo: global.removeSudoFlag(flags),
}

module.exports = createRootUser
