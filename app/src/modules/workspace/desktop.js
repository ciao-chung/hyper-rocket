const { existsSync } = require('fs')
const { resolve } = require('path')
const os = require('os')
class desktop {
  async exec () {
    this.homedir = os.homedir()
    const originDesktopPath = resolve(this.homedir, '桌面')
    const isOriginDesktopExist = existsSync(originDesktopPath)
    const desktopLinkPath = resolve(this.homedir, 'Desktop')
    const isDesktopLinkExist = existsSync(desktopLinkPath)
    logger(`開始建立桌面symbol link: ${desktopLinkPath}`)

    if(isOriginDesktopExist == false || isDesktopLinkExist == true) return
    await execAsync(`ln -s ~/桌面 ~/Desktop`)
  }
}

module.exports = new desktop()
