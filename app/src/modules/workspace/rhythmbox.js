class rhythmbox {
  async exec () {
    try {
      await execAsync(`sudo add-apt-repository ppa:fossfreedom/rhythmbox -y`)
    } catch {
      await execAsync(`sudo add-apt-repository ppa:fossfreedom/rhythmbox -r -y`)
    }
    await execAsync(`sudo apt-get update`)
    try {
      await execAsync(`sudo apt-get install rhythmbox gstreamer1.0-plugins-bad gstreamer1.0-plugins-ugly gnome-control-center rhythmbox-plugin-visualizer -y`)
    } catch {
      logger('rhythmbox安裝失敗', 'yellow')
    }
  }
}

module.exports = new rhythmbox()
