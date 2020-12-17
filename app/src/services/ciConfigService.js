const { resolve, join } = require('path')
const _profileClass = require('@services/_profileClass')
class ciConfigService extends _profileClass{
  getCiConfigFilePath() {
    return join(this.getBaseProfileDirectory(), 'ci.yml')
  }

  getCiConfig() {
    return readYaml(this.getCiConfigFilePath())
  }

  ciConfigExist() {
    return existsSync(this.getCiConfigFilePath())
  }
}

module.exports = new ciConfigService()
