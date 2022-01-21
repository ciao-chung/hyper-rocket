const { resolve } = require('path')
const prettyjson = require('prettyjson')
const _deployAction = require('./_deployAction.js')
const HOOKS = require('@modules/deploy/HOOKS.js')
class init extends _deployAction {
  constructor() {
    super()
    this.stage = 'publish'
  }

  async process(options) {
    this._outputStage(`正在初始化佈署`)
    // 定義佈署選項
    this.deployOptions = {
      workdir: process.env.PWD, // 工作目錄位置
      workdirName: now('YYYYMMDD-HHmmss'), // 名稱
      dumpEnv: false, // dump所有的env(不執行任何佈署動作)
      dump: false, // dump config(不執行任何佈署動作)
      ...options,
    }

    // 定義佈署階段ENV
    global.DEPLOY_ENV = {
      INIT: false,
      DEPLOY_LABEL: null, // 佈署名稱
      DEPLOY_TYPE: 'default', // 佈署類型, 目前有default/vue/laravel
      WORKDIR: null, // 工作目錄
      CONFIG: null, // 佈署設定物件
      CONFIG_DIR: null, // 佈署設定物件目錄
      PROJECT_PATH: null, // 專案目錄
      SOURCE_PATH: null, // 原始碼目錄
      DIST_PATH: null, // PRODUCTION目錄(準備做rsync用), 將在buildHandler各自依照類型定義
      QUEUE_WORKER_DIR: null, // laravel queue worker設定檔目錄位置, 預設為DIST目錄下的queue, 將在buildLaravelHandler內設定
      QUEUE_WORKER_DIRNAME: null, // laravel queue worker設定檔目錄名稱, 預設為DIST目錄下的queue, 將在buildLaravelHandler內設定
      TIMELINE: {
        START: global.now(),
        END: null,
      },
    }


    await this._setupWorkDir()
    await this._setupDeployVariable()
    await this._validateHooks()

    // dump env
    if(this.deployOptions.dumpEnv === true) {
      logger('')
      logger('==========DEPLOY_ENV==========')
      console.log(prettyjson.render(global.DEPLOY_ENV))
      logger('')
      process.exit()
      return
    }
  }

  async _validateHooks() {
    this._outputStage(`正在檢查所有Hooks檔案`)
    let allHookValid = true
    for(const hook of HOOKS) {
      const valid = this._validateSingleHook(hook)
      if(!valid) {
        allHookValid = false
        const relativePath = $helper.getRecursive(DEPLOY_ENV.CONFIG, hook)
        logger(`Hook檔案不存在或不是callback: ${relativePath}`, 'red')
        continue
      }
    }

    if(!allHookValid) {
      process.exit()
      return
    }
  }

  // 設定工作目錄
  async _setupWorkDir() {
    const workdir = resolve(this.deployOptions.workdir, this.deployOptions.workdirName)
    global.DEPLOY_ENV.WORKDIR = workdir
    await execAsync(`sudo mkdir -p ${workdir}`, {
      ignoreError: true
    })
  }

  _getDeployType() {
    const config = global.DEPLOY_ENV.CONFIG
    let result = 'default'
    if(config.type === 'vue') return 'vue'
    if(config.type === 'laravel') return 'laravel'
    if(config.type === 'nuxt') return 'nuxt'
    return result
  }

  // 設定deploy需要的global變數
  async _setupDeployVariable() {
    global.deployOptions = this.deployOptions
    global.DEPLOY_ENV.CONFIG_DIR = resolve(deployOptions.config, '../')
    const config = readYaml(deployOptions.config)
    global.DEPLOY_ENV.INIT = deployOptions.init === true
    global.DEPLOY_ENV.CONFIG = config
    if(!config) {
      logger('佈署設定檔格式不正確', 'red')
      process.exit()
      return
    }

    // 設定
    global.DEPLOY_ENV.DEPLOY_TYPE = this._getDeployType()
    global.DEPLOY_ENV.DEPLOY_LABEL = $helper.getRecursive(DEPLOY_ENV.CONFIG, 'info.label')
    const sourceFolder = global.DEPLOY_ENV.CONFIG.source.folder || '.'
    DEPLOY_ENV.PROJECT_PATH = resolve(DEPLOY_ENV.WORKDIR, 'project')
    DEPLOY_ENV.SOURCE_PATH = resolve(DEPLOY_ENV.WORKDIR, 'project', sourceFolder)

    // dump
    if(this.deployOptions.dump === true) {
      logger('')
      logger(`==========佈署設定內容(${deployOptions.config})==========`)
      console.log(prettyjson.render(config))
      logger('')
      process.exit()
      return
    }
  }
}

module.exports = new init()
