class chrome {
  async exec () {
    await execAsync(`sudo apt-get update`)
    await execAsync(`sudo apt-get install libxss1 libappindicator1 libindicator7 -y`)
    await execAsync(`sudo wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb -P /home`)
    await execAsync(`sudo dpkg -i /home/google-chrome*.deb`, {
      ignoreError: true,
    })
    await execAsync(`sudo apt-get install -f -y`, {
      ignoreError: true,
    })
    await execAsync(`sudo rm -rf /home/google-chrome*.deb`)
    await execAsync(`google-chrome --version`)
  }
}

module.exports = new chrome()
