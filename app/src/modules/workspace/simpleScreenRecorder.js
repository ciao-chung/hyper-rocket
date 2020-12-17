class simpleScreenRecorder {
  async exec () {
    try {
      await execAsync(`sudo add-apt-repository ppa:maarten-baert/simplescreenrecorder -y`)
    } catch {
      await execAsync(`sudo add-apt-repository ppa:maarten-baert/simplescreenrecorder -r -y`)
    }
    await execAsync(`sudo apt-get update`)
    await execAsync(`sudo apt-get install simplescreenrecorder -y`)
  }
}

module.exports = new simpleScreenRecorder()
