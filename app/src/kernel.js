require('shelljs/global')
const notifier = require('node-notifier')
const chalk = require('chalk')
const {basename, resolve, join} = require('path')
const shelljs = require('shelljs')
const {readFileSync, writeFileSync, appendFileSync, existsSync} = require('fs')
const renderService = require('./services/render.js')
const cli = require('cli-ux')
const jsYaml = require('js-yaml')
const moment = require('moment')
const moduleAlias = require('module-alias')
const root = resolve(__dirname, '../')
moduleAlias.addAliases({
  "@root": root,
  "@src": join(root, "./src"),
  "@libs": join(root, "./src/libs"),
  "@modules": join(root, "./src/modules"),
  "@services": join(root, "./src/services"),
})
require('@libs/lodash.js')
const helper = require('@libs/helper.js')
class kernel {
  constructor() {
    this.initChalk()
    global.notify = this.notify
    global.logger = this.logger
    global.readFileSync = readFileSync
    global.moment = moment
    global.now = (format = 'YYYY-MM-DD HH:mm:ss') => moment().format(format)
    global.existsSync = existsSync
    global.writeFile = this.writeFile
    global.writeFileAsRoot = this.writeFileAsRoot
    global.appendFile = this.appendFile
    global.renderService = renderService
    global.removeSudoFlag = (flags) => flags.boolean({
      char: 'x',
      description: chalk.hex(COLOR.TEAL_HEX).bold('不使用sudo執行指令'),
      default: false,
    })
    global.execAsync = (command, options) => this.execAsync(command, options)
    global.getPhpVersion = this.getPhpVersion
    global.execDelay = this.execDelay
    global.runFishShell = this.runFishShell
    global.readYaml = this.readYaml
    global.$helper = helper
    global.execOnServer = this.execOnServer
  }

  initChalk() {
    global.chalk = chalk
    global.COLOR = {
      PINK_HEX: '#f18686',
      BLUE_HEX: '#3490dc',
      PURPLE_HEX: '#9561e2',
      RED_HEX: '#e34c48',
      ORANGE_HEX: '#f6993f',
      YELLOW_HEX: '#ffed4a',
      TEAL_HEX: '#4dc0b5',
      CYAN_HEX: '#6cb2eb',
      GRAY_HEX: '#b3b3b3',
      BLACK_HEX: '#313131',
    }
  }

  /**
   * @param content
   * @param style
   *  - reference: https://github.com/chalk/chalk#colors
   *  - colors: red, green, yellow, blue, magenta, cyan, white
   * @param options
   */
  logger(content, style = 'cyan', options = {}) {
    const result = typeof content == 'object' || typeof content == 'array'
      ? JSON.stringify(content)
      : content

    let display = chalk[`${style}Bright`](result)
    console.log(display)
  }

  async execAsync(command, options = {}) {
    let execOptions = {
      async: true,
      quiet: false, // quiet mode
      ignoreError: false,
      removeSudo: global.removeSudo === true,
      ...options,
    }

    // remove sudo string
    if(execOptions.removeSudo) {
      command = command.replace(new RegExp('sudo', 'g'), '')
    }

    // quiet mode
    if(execOptions.quiet != true) {
      logger(`RUN: ${command}`)
    }

    // cwd
    if(execOptions.cwd) {
      logger(`cwd: ${options.cwd}`)
    }

    try {
      const result = await this._execPromise(command, execOptions)
      return result
    } catch (error) {
      if(execOptions.ignoreError === true) {
        return error
      }
      throw error
      return error
    }
  }

  _execPromise(command, execOptions) {
    return new Promise((resolve, reject) => {
      let errorColor = execOptions.ignoreError === true ? 'yellow' : 'red'
      if(execOptions.errorColor) {
        errorColor = execOptions.errorColor
      }
      try {
        shelljs.exec(command, execOptions, async(code, stdout, stderr) => {
          if(code != 0) {
            logger(stderr, errorColor)
            return reject({ type: 'error', log: stderr })
          }

          return resolve({ type: 'success', log: stdout })
        })
      } catch(error) {
        logger(`Execute Command Fail: ${error}`, errorColor)
        return reject({ type: 'error', log: error })
      }
    })
  }

  writeFile(path, content) {
    writeFileSync(path, content, 'utf-8')
  }

  appendFile(path, content) {
    appendFileSync(path, content, 'utf-8')
  }

  async writeFileAsRoot(path, content, executeOption = {ignoreError: true}) {
    const filename = basename(path)
    const tempPath = `/tmp/${filename}`
    global.writeFile(tempPath, content)
    await execAsync(`sudo mv ${tempPath} ${path}`, executeOption)
  }

  async getPhpVersion() {
    try {
      const result = await execAsync(`echo "<?php echo phpversion();" | php`, {
        quiet: true,
      })
      logger('')
      if(!result.log) return null
      const partials = result.log.split('.')
      return `${partials[0]}.${partials[1]}`
    } catch (error) {
      return null
    }
  }

  execDelay(delaySecond = 5, action = '') {
    let countdown = delaySecond
    let spinner = (countdown) => {
      let message = `${chalk.hex(COLOR.TEAL_HEX).bold(countdown+'秒')}後將執行接下來的操作\n`
      if(action) message += `${action}\n`
      message += `如果反悔的話請按下${chalk.hex(COLOR.TEAL_HEX).bold('Ctrl+C')}終止`
      return cli.ux.action.start(message, '', {stdout: true})
    }
    return new Promise(resolve => {
      spinner(countdown)
      let interval = setInterval(() => {
        countdown -= 1
        spinner(countdown)
      }, 1000)


      setTimeout(() => {
        cli.ux.action.stop('')
        clearTimeout(interval)
        resolve()
      }, delaySecond*1000)
    })
  }

  async runFishShell(script, executeOptions = {}) {
    if(!executeOptions.cwd) executeOptions.cwd = process.env.PWD
    const timestamp = (new Date()).getTime()
    const filename = `/tmp/${timestamp}.sh`
    logger(`FISH: ${script}`, 'cyan')
    await execAsync(`echo "#!/bin/bash \nfish <<'END_FISH' \n ${script} \nEND_FISH" > ${filename}`, {
      quiet: true,
      ...executeOptions,
    })

    await execAsync(`bash ${filename}`, {
      quiet: true,
      ...executeOptions,
    })

    await execAsync(`rm ${filename}`, {
      quiet: true,
      ...executeOptions,
    })
  }

  readYaml(path) {
    let content = null
    try {
      content = readFileSync(path, 'utf8')
    } catch (error) {
      logger(`${path} 檔案不存在或讀取失敗`, 'yellow')
      return null
    }

    let result = null
    try {
      result = jsYaml.safeLoad(content)
    } catch (error) {
      logger(error, 'red')
      logger(`${path} YAML格式不正確`, 'yellow')
      return null
    }

    return result
  }

  notify(message = '', options = {}) {
    let title = !options.title ? `🚀 HYPER ROCKET` : options.title
    notifier.notify({
      title,
      message,
      icon: resolve(__dirname, 'assets/logo.png')
    })
  }

  async execOnServer(server, command, options = {}) {
    options.removeSudo = global.removeRemoteSudo === true
    if(options.remoteCwd) {
      command = `cd ${options.remoteCwd}; ${command}`
    }

    if(server.local === true) {
      await execAsync(command, options)
      return
    }

    const prefix = `ssh -o StrictHostKeyChecking=no ${server.user}@${server.host}`
    await execAsync(`${prefix} "${command}"`, options)
  }
}

new kernel()
