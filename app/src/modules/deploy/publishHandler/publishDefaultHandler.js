const _basePublishHandler = require('./_basePublishHandler')
class publishDefaultHandler extends _basePublishHandler{
  async publish() {
    await this.publishMultiServer()
  }
}


module.exports = new publishDefaultHandler()
