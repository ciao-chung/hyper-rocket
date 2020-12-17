class apidoc {
  async exec () {
    await execAsync(`sudo yarn global add apidoc -y`)
  }
}

module.exports = new apidoc()
