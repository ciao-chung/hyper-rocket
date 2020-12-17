class pitivi {
  async exec () {
    await execAsync(`sudo apt-get install pitivi -y`)
  }
}

module.exports = new pitivi()
