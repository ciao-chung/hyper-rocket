const _baseExtraServiceHandler = require('./_baseExtraServiceHandler')
class extraServiceLaravelHandler extends _baseExtraServiceHandler{
  async _setupEachServerExtraService(index, server) {
    this.remoteLaravelPath = DEPLOY_ENV.CONFIG.rsync.path
    await this._startQueueWorkers(server)
  }

  async _startQueueWorkers(server) {
    const queue = DEPLOY_ENV.CONFIG.queue
    if(!queue) return
    if(queue.enabled != true) return
    if(!Array.isArray(queue.workers)) return
    if(queue.workers.length == 0) return
    this._outputStage(`開始啟動Queue workers`)
    for (const worker of queue.workers) {
      try {
        await this._startEachQueueWorker(server, worker)
      } catch (error) {
        logger(`queue worker設定發生錯誤`, 'yellow')
        logger(error, 'yellow')
      }
    }
  }

  async _startEachQueueWorker(server, worker) {
    const remoteQueueWorkerFilePath = `${this.remoteLaravelPath}/${DEPLOY_ENV.QUEUE_WORKER_DIRNAME}/${worker.filename}`

    await execOnServer(server, `sudo chmod +x ${this.remoteLaravelPath}/${DEPLOY_ENV.QUEUE_WORKER_DIRNAME}/start-queue.sh`, {
      ignoreError: true,
      remoteCwd: this.remoteLaravelPath,
    })

    await execOnServer(server, `sudo pm2 delete ${worker.name}`, {
      ignoreError: true,
      remoteCwd: this.remoteLaravelPath,
    })

    await execOnServer(server, `sudo pm2 start ${remoteQueueWorkerFilePath} --restart-delay=1000`, {
      ignoreError: true,
      remoteCwd: this.remoteLaravelPath,
    })

    await execOnServer(server, `sudo pm2 start ${remoteQueueWorkerFilePath} --restart-delay=1000`, {
      ignoreError: true,
      remoteCwd: this.remoteLaravelPath,
    })

    await execOnServer(server, `sudo pm2 startup`, {
      ignoreError: true,
      remoteCwd: this.remoteLaravelPath,
    })

    await execOnServer(server, `sudo pm2 save`, {
      ignoreError: true,
      remoteCwd: this.remoteLaravelPath,
    })
  }
}


module.exports = new extraServiceLaravelHandler()
