class gimp {
  async exec () {
    try {
      await execAsync(`sudo add-apt-repository ppa:otto-kesselgulasch/gimp-edge -y`)
    } catch {
      await execAsync(`sudo add-apt-repository ppa:otto-kesselgulasch/gimp-edge -r -y`)
    }
    await execAsync(`sudo apt-get update`)
    await execAsync(`sudo apt-get install gimp gimp-gmic -y`)
  }
}

module.exports = new gimp()
