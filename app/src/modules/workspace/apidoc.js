class apidoc {
  async exec () {
    await execAsync(`sudo yarn global add apidoc@0.29.0 -y`)
  }
}

module.exports = new apidoc()
