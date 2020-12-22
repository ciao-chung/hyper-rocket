const _deployAction = require('./_deployAction.js')
const { resolve, join, basename } = require('path')
class fetchSource extends _deployAction {
  constructor() {
    super()
    this.stage = 'fetch'
  }

  async process() {
    if(this._shouldSkip(this.stage) === true) {
      logger(`跳過Fetch階段`, 'yellow')
      return
    }

    this.workdir = global.DEPLOY_ENV.WORKDIR
    this.fetchType = this._getFetchType()
    this._outputStage(`Fetch source(${this.fetchType})`)
    await this._callHook('source.beforeFetchHook')
    await this._removeProjectPath()
    await this._fetch()
    await this._callHook('source.afterFetchHook')
    this._outputStage(`原始碼目錄Fetch完成: ${DEPLOY_ENV.SOURCE_PATH}`)
    notify(`原始碼目錄Fetch完成: ${DEPLOY_ENV.SOURCE_PATH}`)
  }

  _getFetchType() {
    const type = DEPLOY_ENV.CONFIG.source.fetchType
    if(type === 'git') return 'git'
    if(type === 'path') return 'path'
    if(type === 'zip') return 'zip'
    return null
  }

  async _fetch() {
    if(this.fetchType === 'git') {
      await this._fetchByGit()
      return
    }

    if(this.fetchType === 'zip') {
      await this._fetchByZip()
      return
    }

    if(this.fetchType === 'path') {
      await this._fetchByPath()
      return
    }

    logger(`尚未定義任何fetch或是fetch類型不正確: ${this.fetchType}`, 'yellow')
    process.exit()
    return
  }

  async _removeProjectPath() {
    await execAsync(`rm -rf project`, {
      cwd: this.workdir,
      quiet: true,
    })
  }

  async _fetchByGit() {
    await execAsync(`git clone ${DEPLOY_ENV.CONFIG.source.repo} project`, {
      cwd: this.workdir
    })

    await execAsync(`git checkout ${DEPLOY_ENV.CONFIG.source.revision}`, {
      cwd: DEPLOY_ENV.PROJECT_PATH,
    })

    this._outputStage(`正在建立原始碼目錄: ${DEPLOY_ENV.SOURCE_PATH}`)
    this._outputStage(`正在建立GIT版本資訊檔: ${DEPLOY_ENV.SOURCE_PATH}`)
    const gitInfo = `git log -1 --pretty="Hash: %H %nRefs: %d %nCommit: %BAuthor: %aN %nDate: %ai"`
    await execAsync(`${gitInfo}`, {
      cwd: DEPLOY_ENV.PROJECT_PATH,
    })
    await execAsync(`${gitInfo} > deploy.commit`, {
      cwd: DEPLOY_ENV.PROJECT_PATH,
    })
  }

  async _fetchByZip() {
    const url = DEPLOY_ENV.CONFIG.source.url
    const zipFilename = basename(url)

    logger(`開始下載ZIP原始碼: ${url}`, 'green')

    await execAsync(`mkdir -p project`, {
      cwd: this.workdir
    })

    await execAsync(`wget ${url}`, {
      cwd: DEPLOY_ENV.PROJECT_PATH,
    })

    logger(`開始處理ZIP原始碼檔案: ${zipFilename}`, 'green')
    await execAsync(`unzip -o -O UTF8 ${zipFilename}`, {
      cwd: DEPLOY_ENV.PROJECT_PATH,
    })
  }

  async _fetchByPath() {
    const sourceFrom = DEPLOY_ENV.CONFIG.source.path
    const exist = existsSync(sourceFrom)
    if(!exist) {
      logger(`Fetch source目錄不存在: ${sourceFrom}`, 'red')
      process.exit()
    }

    await execAsync(`cp -r ${sourceFrom} project`, {
      cwd: this.workdir
    })
  }
}

module.exports = new fetchSource()
