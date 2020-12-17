class vlc {
  async exec () {
    await execAsync(`sudo apt-get update`)
    await execAsync(`sudo apt-get install vlc -y`)
  }
}

module.exports = new vlc()
