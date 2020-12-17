const os = require('os')
const { resolve, join } = require('path')
class _profileClass {
  constructor() {
    this.homedir = os.homedir()
  }

  getBaseProfileDirectory() {
    const directoryPath = resolve(this.homedir, '.hyper-rocket')
    execAsync(`mkdir -p ${directoryPath}`, {
      quiet: true,
      ignoreError: true,
    })
    return directoryPath
  }
}

module.exports = _profileClass
