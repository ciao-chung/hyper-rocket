const {Command, flags} = require('@oclif/command')
const os = require('os')
require('../kernel.js')
const mustache = require('mustache')
class RenderCommand extends Command {
  async run() {
    const {flags} = this.parse(RenderCommand)
    global.removeSudo = flags.removeSudo
    this.commandFlags = flags
    this.chownUser = !flags.chown ? os.userInfo().username : flags.chown
    this.output = flags.output

    await this._setupTemplate()
    await this._setupParams()

    if(!this.template) {
      logger(`尚未設定樣板`, 'yellow')
      this.exit()
      return
    }

    // mustache.js render
    const resultContent = mustache.render(this.template, this.params)
    await writeFileAsRoot(this.output, resultContent, {
      quiet: true,
    })

    if(this.commandFlags.preview === true) {
      logger(``)
      logger(`==========${this.output}檔案內容預覽==========`, 'white')
      logger(resultContent, 'green')
      logger(``)
    }

    // chown
    await execAsync(`sudo chown ${this.chownUser}:${this.chownUser} ${this.output}`, {
      ignoreError: true
    })


    // chown
    if(this.commandFlags.chmod) {
      await execAsync(`sudo chmod ${this.commandFlags.chmod} ${this.output}`, {
        ignoreError: true
      })
    }
  }

  async _setupTemplate() {
    this.template = ''

    // setup template content by file
    if(this.commandFlags.templateFile) {
      if(existsSync(this.commandFlags.templateFile) === false) {
        logger(`樣板檔案 ${this.commandFlags.templateFile} 不存在`, 'red')
        this.exit()
        return
      }

      this.template = readFileSync(this.commandFlags.templateFile, 'utf8')
      return
    }

    this.template = this.commandFlags.template
  }

  async _setupParams() {
    this.params = {}

    // setup params by file
    if(this.commandFlags.paramsFile) {
      if(existsSync(this.commandFlags.paramsFile) === false) {
        logger(`變數YAML檔案 ${this.commandFlags.paramsFile} 不存在`, 'red')
        this.exit()
        return
      }

      this.params = readYaml(this.commandFlags.paramsFile)
      return
    }

    const flagParams = !Array.isArray(this.commandFlags.params) ? [] : this.commandFlags.params
    for (const param of flagParams) {
      const partials = param.split('=')
      const key = partials[0]
      const value = partials[1]
      this.params[key] = value
    }
  }
}

RenderCommand.description = `透過${chalk.hex(COLOR.CYAN_HEX).bold('{{mustache.js}}')}將樣板、變數render出檔案

可使用${chalk.hex(COLOR.CYAN_HEX).bold('params')}選項直接在command line設定多個變數

例如-p host=127.0.0.1 -p site=https://foobar.com

或是使用${chalk.hex(COLOR.CYAN_HEX).bold('paramsFile')}選項指定變數yaml檔案

詳細${chalk.hex(COLOR.CYAN_HEX).bold('{{mustache.js}}')}樣板、變數使用方式

請參考官方文件: https://github.com/janl/mustache.js
`

RenderCommand.flags = {
  templateFile: flags.string({
    description: '樣板檔案路徑',
  }),
  template: flags.string({
    char: 't',
    description: '樣板內容',
    default: '',
  }),
  paramsFile: flags.string({
    description: `變數yaml檔案路徑(標準key value格式)
作為${chalk.hex(COLOR.CYAN_HEX).bold('{{mustache.js}}')}變數使用`,
  }),
  params: flags.string({
    char: 'p',
    multiple: true,
    description: `${chalk.hex(COLOR.CYAN_HEX).bold('{{mustache.js}}')}變數
請使用--params key=value 這種來設定`,
  }),
  output: flags.string({
    char: 'o',
    description: '輸出路徑',
    required: true,
  }),
  preview: flags.boolean({
    description: '預覽輸出的檔案內容(敏感資訊檔案請勿使用此選項)',
  }),
  chown: flags.string({
    description: '使用chown設定輸出檔案',
  }),
  chmod: flags.string({
    description: '使用chmod設定輸出檔案, 請使用標準chmod格式, 例如: 400, o+x, g-w',
  }),
  removeSudo: global.removeSudoFlag(flags),
}

module.exports = RenderCommand
