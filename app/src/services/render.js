const { existsSync, readFileSync, writeFileSync, appendFileSync } = require('fs')
const { resolve, join } = require('path')
const mustache = require('mustache')
class renderService {
  constructor() {
    this.mustache = mustache
    this.baseFilesFolder = resolve(__dirname, '../', 'files')
  }

  _getTemplateContent(templatePath, absolutePath) {
    const path = absolutePath === true ? templatePath : join(this.baseFilesFolder, templatePath)
    logger(`正在讀取檔案樣板: ${path}`, 'blue')
    const result = readFileSync(path, { encoding: 'utf-8'})
    return result
  }

  /**
   * @param templatePath start from 'src/files'
   * @param data template data
   */
  render(templatePath, data = {}, options = {}) {
    const absolutePath = options.absolutePath === true
    const templateContent = this._getTemplateContent(templatePath, absolutePath)
    return mustache.render(templateContent, data)
  }
}

module.exports = new renderService()
