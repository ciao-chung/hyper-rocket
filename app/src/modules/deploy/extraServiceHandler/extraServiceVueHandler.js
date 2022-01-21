const { resolve } = require('path')
const _baseExtraServiceHandler = require('./_baseExtraServiceHandler')
class extraServiceVueHandler extends _baseExtraServiceHandler{
  async _setupEachServerExtraService(index, server) {}
}


module.exports = new extraServiceVueHandler()
