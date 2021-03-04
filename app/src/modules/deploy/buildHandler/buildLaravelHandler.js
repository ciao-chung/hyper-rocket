const { resolve } = require('path')
const _baseBuildHandler = require('./_baseBuildHandler')
class buildLaravelHandler extends _baseBuildHandler {
  async setupDistPath() {
    const distDir = !DEPLOY_ENV.CONFIG.build.distDir
      ? '.'
      : DEPLOY_ENV.CONFIG.build.distDir
    DEPLOY_ENV.DIST_PATH = resolve(DEPLOY_ENV.SOURCE_PATH, distDir)
  }

  async _startBuild() {
    notify(`開始執行composer install`)
    await this._composerInstall()
    await this._setupEnvFile()
    await this._compileQueueConfig()
  }

  async _composerInstall() {
    await execAsync(`composer install`, {
      cwd: DEPLOY_ENV.SOURCE_PATH,
    })
  }

  async _setupEnvFile() {
    await execAsync(`cp .env.example .env`, {
      cwd: DEPLOY_ENV.SOURCE_PATH,
    })
    const backendEnv = DEPLOY_ENV.CONFIG.build.env
    if(typeof backendEnv != 'object') return
    this._outputStage(`開始設定Laravel .env設定檔`)
    for(const key in backendEnv) {
      const value = backendEnv[key]
      logger(`正在設定env變數: ${key}`, 'yellow')
      await execAsync(`php artisan env:set ${key} "${value}" --quiet`, {
        cwd: DEPLOY_ENV.SOURCE_PATH,
        quiet: true,
      })
    }
  }

  async _compileQueueConfig() {
    const queue = DEPLOY_ENV.CONFIG.queue
    if(!queue) return
    if(queue.enabled != true) return
    if(!Array.isArray(queue.workers)) return
    if(queue.workers.length == 0) return

    const workerDir = !queue.workerDir ? 'queue' : queue.workerDir
    DEPLOY_ENV.QUEUE_WORKER_DIR = resolve(DEPLOY_ENV.DIST_PATH, workerDir)
    DEPLOY_ENV.QUEUE_WORKER_DIRNAME = workerDir

    this._outputStage(`開始設定PM2 queue worker config`)
    let startQueueShell = '#!/usr/bin/env bash'
    for (const worker of queue.workers) {
      const result = await this._compileQueueConfigFile(worker)
      if(result) startQueueShell += result
    }

    const startQueueShellPath = resolve(DEPLOY_ENV.QUEUE_WORKER_DIR, 'start-queue.sh')
    await writeFile(startQueueShellPath, startQueueShell)
  }


  async _compileQueueConfigFile(worker) {
    const workerConfigPath = resolve(DEPLOY_ENV.QUEUE_WORKER_DIR,worker.filename)
    if(existsSync(workerConfigPath) != true) {
      logger(`Queue worker設定檔不存在: ${workerConfigPath}`, 'red')
      return null
    }

    const variable = typeof worker.variable != 'object' ? {} : worker.variable
    const yamlFileContent = global.renderService.render(workerConfigPath, variable, {
      absolutePath: true,
    })
    await writeFile(workerConfigPath, yamlFileContent)

    const shell = `
pm2 delete ${worker.name}
pm2 start ${DEPLOY_ENV.CONFIG.rsync.path}/queue/${worker.filename} --restart-delay=1000
pm2 startup
pm2 save`

    return shell
  }
}

module.exports = new buildLaravelHandler()
