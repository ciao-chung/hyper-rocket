require('../kernel.js')
const {Command, flags, args } = require('@oclif/command')
const chrome = require('@modules/workspace/chrome.js')
const phpstorm = require('@modules/workspace/phpstorm.js')
const desktop = require('@modules/workspace/desktop.js')
const dbeaver = require('@modules/workspace/dbeaver.js')
const dolphin = require('@modules/workspace/dolphin.js')
const simpleScreenRecorder = require('@modules/workspace/simpleScreenRecorder.js')
const pitivi = require('@modules/workspace/pitivi.js')
const gimp = require('@modules/workspace/gimp.js')
const vlc = require('@modules/workspace/vlc.js')
const inkscape = require('@modules/workspace/inkscape.js')
const ngrok = require('@modules/workspace/ngrok.js')
const unetbootin = require('@modules/workspace/unetbootin.js')
const disk = require('@modules/workspace/disk.js')
const openvpn = require('@modules/workspace/openvpn.js')
const apidoc = require('@modules/workspace/apidoc.js')
const redisDesktopManager = require('@modules/workspace/redisDesktopManager.js')

class ToolsCommand extends Command {
  async run() {
    const { args, flags} = this.parse(ToolsCommand)
    this.version = args.version
    global.removeSudo = flags.removeSudo
    await execAsync(`sudo apt-get update`)
    if(flags.all === true || flags.chrome) await chrome.exec()
    if(flags.all === true || flags.phpstorm) await phpstorm.exec()
    if(flags.all === true || flags.desktop) await desktop.exec()
    if(flags.all === true || flags.dolphin) await dolphin.exec()
    if(flags.all === true || flags.simpleScreenRecorder) await simpleScreenRecorder.exec()
    if(flags.all === true || flags.pitivi) await pitivi.exec()
    if(flags.all === true || flags.gimp) await gimp.exec()
    if(flags.all === true || flags.vlc) await vlc.exec()
    if(flags.all === true || flags.inkscape) await inkscape.exec()
    if(flags.all === true || flags.ngrok) await ngrok.exec()
    if(flags.all === true || flags.dbeaver) await dbeaver.exec()
    if(flags.all === true || flags.unetbootin) await unetbootin.exec()
    if(flags.all === true || flags.disk) await disk.exec()
    if(flags.all === true || flags.openvpn) await openvpn.exec()
    if(flags.all === true || flags.apidoc) await apidoc.exec()
    if(flags.all === true || flags.redisDesktopManager) await redisDesktopManager.exec()

    logger(`工作環境安裝完成`)
  }
}

ToolsCommand.description = `安裝工作環境
可透過選項安裝指定工具
或是使用all選項一安裝全部工具
`

ToolsCommand.flags = {
  all: flags.boolean({ description: '一次安裝全部工具', default: false }),
  chrome: flags.boolean({ description: 'Google Chrome', default: false }),
  phpstorm: flags.boolean({ description: 'phpStorm', default: false }),
  desktop: flags.boolean({ description: '建立Desktop symbol link', default: false }),
  dolphin: flags.boolean({ description: '安裝dolphin檔案管理器', default: false }),
  simpleScreenRecorder: flags.boolean({ description: '畫面錄影工具', default: false }),
  peek: flags.boolean({ description: '畫面錄影GIF工具', default: false }),
  pitivi: flags.boolean({ description: '影片剪輯工具', default: false }),
  rhythmbox: flags.boolean({ description: '音樂播放器', default: false }),
  gimp: flags.boolean({ description: '圖片編輯工具', default: false }),
  vlc: flags.boolean({ description: 'VLC影片播放器', default: false }),
  inkscape: flags.boolean({ description: '向量圖形編輯器', default: false }),
  ngrok: flags.boolean({ description: 'Local服務轉到公開網域', default: false }),
  dbeaver: flags.boolean({ description: '資料庫圖形化界面工具', default: false }),
  unetbootin: flags.boolean({ description: 'Live USB工具', default: false }),
  disk: flags.boolean({ description: 'Gnome Disk Utility工具', default: false }),
  apidoc: flags.boolean({ description: 'HTTP文件工具', default: false }),
  openvpn: flags.boolean({ description: 'VPN工具', default: false }),
  redisDesktopManager: flags.boolean({ description: 'Redis圖形化界面工具', default: false }),
  removeSudo: global.removeSudoFlag(flags),
}

module.exports = ToolsCommand
