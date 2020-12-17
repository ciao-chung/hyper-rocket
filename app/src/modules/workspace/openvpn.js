class openvpn {
  async exec () {
    await execAsync(`sudo apt-get install openvpn -y`)
  }
}

module.exports = new openvpn()
