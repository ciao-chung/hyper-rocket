const {Command, flags} = require('@oclif/command')
const lineNotifyService = require('@services/lineNotifyService.js')
class testLineNotify extends Command {
  async run() {
    const {flags} = this.parse(testLineNotify)
    lineNotifyService.init()
    lineNotifyService.send(`🚀 HYPER ROCKET測試通知\n${now()}`)
  }
}

testLineNotify.description = `測試CI Line Notify`

testLineNotify.flags = {}

module.exports = testLineNotify
