class simpleScreenRecorder {
  async exec () {
    try {
      await execAsync(`sudo add-apt-repository ppa:peek-developers/stable -y`)
    } catch {
      await execAsync(`sudo add-apt-repository ppa:peek-developers/stable -r -y`)
    }
    await execAsync(`sudo apt-get update`)
    await execAsync(`sudo apt-get install peek -y`)
  }
}

module.exports = new simpleScreenRecorder()
