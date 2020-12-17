class phpstorm {
  async exec () {
    await execAsync(`sudo snap install phpstorm --classic`)
  }
}

module.exports = new phpstorm()
