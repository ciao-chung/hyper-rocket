class inkscape {
  async exec () {
    try {
      await execAsync(`sudo add-apt-repository ppa:inkscape.dev/stable -y`)
    } catch {
      await execAsync(`sudo add-apt-repository ppa:inkscape.dev/stable -r -y`)
    }
    await execAsync(`sudo apt-get update`)
    await execAsync(`sudo apt install inkscape -y`)
  }
}

module.exports = new inkscape()
