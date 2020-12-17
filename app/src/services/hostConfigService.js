const { resolve, join } = require('path')
const _profileClass = require('@services/_profileClass')
class hostConfigService extends _profileClass{
  getHostConfigFilePath() {
    return join(this.getBaseProfileDirectory(), 'host.yml')
  }

  getHostConfig() {
    return readYaml(this.getHostConfigFilePath())
  }

  hostConfigExist() {
    return existsSync(this.getHostConfigFilePath())
  }

  async createDefaultConfig() {
    await writeFile(this.getHostConfigFilePath(), this.getDefaultConfigContent())
  }

  getDefaultConfigContent() {
    return `
hosts:
  - name: Server 1
    user: site
    host: foobar.com.tw
`
  }
}

module.exports = new hostConfigService()
