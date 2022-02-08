const os = require('os')
const { writeFileSync } = require('fs')
const { resolve } = require('path')
class fish {
  constructor() {
    this.pwd = process.env.PWD
  }
  async install() {

    await execAsync(`sudo apt-get update`)
    await execAsync(`sudo apt-get install git -y`)
    try {
      await execAsync(`sudo apt-add-repository ppa:fish-shell/release-2 -y`)
    } catch {
      await execAsync(`sudo apt-add-repository ppa:fish-shell/release-2 -r -y`)
    }
    await execAsync(`sudo apt-get update`)
    await execAsync(`sudo apt-get install fish -y`)
    await execAsync(`sudo usermod -s /usr/bin/fish ${os.userInfo().username}`)
    await execAsync(`curl https://raw.githubusercontent.com/oh-my-fish/oh-my-fish/master/bin/install > install`, { cwd: this.pwd })
    await execAsync(`fish install --path=~/.local/share/omf --config=~/.config/omf --noninteractive`, { cwd: this.pwd })
    await execAsync(`rm install`, { cwd: this.pwd })
  }

  async setupGreeting(greeting = '', color = 'yellow') {
    const homedir = os.homedir()
    const greetingFilePath = resolve(homedir, `.config/fish/functions/fish_greeting.fish`)

    if(!greeting) {
      logger(`正在刪除${greetingFilePath}`, 'yellow')
      await execAsync(`rm -rf ${greetingFilePath}`)
      return
    }

    writeFileSync(
      greetingFilePath,
      `
function fish_greeting
  set_color ${color}
  echo "${greeting}"
  set_color normal
end
`,
      'utf-8'
    )
  }

  async setupTheme(theme) {
    this.theme = theme
    await runFishShell(`omf install ${this.theme}`, { ignoreError: true })
    await runFishShell(`omf theme ${this.theme}`, { ignoreError: true })

    const homedir = os.homedir()
    const fishConfigPath = resolve(homedir, '.config/fish/')
    await execAsync(`mkdir -p ${fishConfigPath}`)
    await execAsync(`touch ${resolve(fishConfigPath, 'config.fish')}`)
    writeFileSync(
      resolve(homedir, '.config/fish/config.fish'),
      this._getFishConfig(),
      'utf-8'
    )
    logger(`Fish Theme設定完成`, 'yellow')
    logger(`請執行 omf theme reload 更新`, 'yellow')
  }

  _getFishConfig() {
    const baseConfig = this._getBaseFishConfig()
    const themeConfig = this._getThemeConfig()
    return `${baseConfig}

${themeConfig}
`
  }

  _getThemeConfig() {
    // https://github.com/oh-my-fish/oh-my-fish/blob/master/docs/Themes.md#bobthefish
    if (this.theme === 'bobthefish') {
      return `
set -g theme_display_git yes
set -g theme_display_git_untracked yes
set -g theme_display_git_ahead_verbose yes
set -g theme_git_worktree_support yes
set -g theme_display_vagrant yes
set -g theme_display_docker_machine no
set -g theme_display_hg yes
set -g theme_display_virtualenv no
set -g theme_display_ruby no
set -g theme_display_user yes
set -g theme_display_vi no
set -g theme_display_date no
set -g theme_display_cmd_duration yes
set -g theme_title_display_process yes
set -g theme_title_display_path no
set -g theme_title_use_abbreviated_path no
set -g theme_date_format "+%a %H:%M"
set -g theme_avoid_ambiguous_glyphs yes
set -g theme_powerline_fonts no
set -g theme_nerd_fonts yes
set -g theme_show_exit_status yes
set -g default_user your_normal_user
set -g theme_color_scheme dark
set -g fish_prompt_pwd_dir_length 0
set -g theme_project_dir_length 1
`
    }

    return ''
  }

  _getBaseFishConfig() {
    return `
alias la="php artisan"
alias clip="xclip -i -selection clipboard"
alias ..="cd ../"
alias ...="cd ../../"
alias ....="cd ../../../"
alias .....="cd ../../../../"
alias phpu="./vendor/bin/phpunit"
alias sf="app/console"
alias sshsample="ssh -o StrictHostKeyChecking=no username@host.com"
set -g fish_prompt_pwd_dir_length 0
`
  }
}

module.exports = new fish()
