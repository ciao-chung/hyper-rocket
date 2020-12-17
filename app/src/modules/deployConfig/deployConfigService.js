require('../../kernel.js')
const os = require('os')
const {resolve, join} = require('path')
class deployConfigService {
  // 建立範例設定檔
  async createConfig(options) {
    this.output = !options.output ? process.env.PWD : options.output
    this.username = os.userInfo().username
    this.deployType = options.type

    await this._setupInfoByType()
    await this._copyFolder()
    await this._setupDeployConfigFile()
  }

  async _setupInfoByType() {
    this.info = {}
    switch (this.deployType) {
      case 'vue':
        this.info = {
          configFilename: 'vue-project-deploy.yml'
        }
        break
      case 'laravel':
        this.info = {
          configFilename: 'laravel-project-deploy.yml'
        }
        break
      default:
        this.info = {
          configFilename: 'default-deploy.yml'
        }
        break
    }
  }

  async _copyFolder() {
    this.templatePath = resolve(__dirname, '../../', 'files/deploy/config', this.deployType)
    this.outputFolderPath = resolve(this.output, this.deployType)
    await execAsync(`sudo cp -r ${this.templatePath} ${this.output}`)
    await execAsync(`sudo chown -R ${this.username}:${this.username} ${this.outputFolderPath}`)
    logger(`範例佈署設定檔將輸出到: ${this.output}`)
  }

  async _setupDeployConfigFile() {
    const deployFilePath = resolve(this.outputFolderPath, this.info.configFilename)
    const deployConfigContent = global.renderService.render(`deploy/config/${this.deployType}/${this.info.configFilename}`, {
      path: this.output,
    })
    await writeFileAsRoot(deployFilePath, deployConfigContent)
  }
}

module.exports = new deployConfigService()
