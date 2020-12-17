const {Command, flags} = require('@oclif/command')
const mailService = require('@services/mailService.js')
class testMail extends Command {
  async run() {
    const {flags} = this.parse(testMail)
    mailService.init()
    mailService.send({
      subject: `🚀 HYPER ROCKET 測試信件 ${now()}`,
      targets: flags.target,
      text: `🚀 HYPER ROCKET 測試信件 ${now()}`,
    })
  }
}

testMail.description = `測試CI Mail`

testMail.flags = {
  target: flags.string({
    char: 't',
    required: true,
    multiple: true,
    description: '發信對象',
  }),
}

module.exports = testMail
