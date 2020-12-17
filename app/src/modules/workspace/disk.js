class disk {
  async exec () {
    await execAsync(`sudo apt-get install gnome-disk-utility -y`)
  }
}

module.exports = new disk()
