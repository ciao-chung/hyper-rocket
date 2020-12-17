class redisDesktopManager {
  async exec () {
    await execAsync(`sudo snap install redis-desktop-manager`)
  }
}

module.exports = new redisDesktopManager()
