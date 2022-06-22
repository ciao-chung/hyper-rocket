const XLSX = require('xlsx')
const {Command, flags} = require('@oclif/command')
const {resolve} = require('path')

const originRulePropertyKey = 'origin' // 舊站網址欄位名稱
const newRulePropertyKey = 'new' // 新站網址欄位名稱

class nginxRedirectConfig extends Command {
  async run() {
    const {flags} = this.parse(nginxRedirectConfig)
    this.flags = flags
    this.path = flags.path
    this.originHost = flags.originHost
    this.newHost = flags.newHost
    this.redirectRulesContent = `
    # 301 redirect start
`
    if(!existsSync(this.path)) {
      logger(`Excel檔案不存在(${this.path})`, 'red')
      return
    }

    await this.readExcel()
    await this.createNginxConfig()
  }

  async readExcel() {
    logger(`開始處理Excel: ${this.path}`)
    this.rules = []
    const fileContent = readFileSync(this.path)
    this.workbook = XLSX.read(fileContent, { type: 'array' })
    this.sheetName = this.workbook.SheetNames[0]
    this.data = XLSX.utils.sheet_to_json(this.workbook.Sheets[this.sheetName])
    for(const index in this.data) {
      await this.handleRuleRow(index)
    }
    if(this.flags.debug === true) {
      logger(`\nrules`, 'white')
      console.warn(this.rules)
      logger(`\n`, 'white')
    }
  }

  async createNginxConfig() {
    // 逐一產生nginx redirect 301規則
    for(const rule of this.rules) {
      const decodeUrl = decodeURI(rule.originRoute)
      let nginx301Rule = `
    if ($request_uri = ${rule.originRoute}) {
        add_header Cache-Control no-cache;
        return 301 $web_host${rule.newRoute};
    }
`
      this.redirectRulesContent += `${nginx301Rule}`
    }
    this.redirectRulesContent += `
    # 301 redirect end
`

    const content = this.getNginxConfigContent()
    await execAsync(`mkdir -p ${this.flags.output}`)
    const outputPath = resolve(this.flags.output, 'nginx.conf')
    writeFile(outputPath, content, 'utf-8')
    logger(`nginx設定檔已經成功輸出: ${outputPath}`, 'yellow')
  }

  async handleRuleRow(index) {
    const rule = this.data[index]
    const originRule = rule[originRulePropertyKey]
    const newRule = rule[newRulePropertyKey]
    const originRoute = this.getRoute(originRule, this.originHost)
    const newRoute = this.getRoute(newRule, this.newHost)
    if(this.flags.debug === true) {
      logger(`rule migrate: [ ${originRoute} ] --> [ ${newRoute} ]`, 'white')
    }
    if(!originRoute) {
      logger(`index: ${index}, 無法處理`, 'yellow')
      logger(`originRule: ${originRule}`)
      return
    }
    this.rules.push({
      index,
      newRoute,
      originRoute,
    })
  }

  // 去除http/https/domain留下route
  getRoute(rule, host) {
    let result = rule
    if(typeof result != 'string') return null
    const httpsPattern = new RegExp(`https://${host}`, 'g')
    const httpPattern = new RegExp(`http://${host}`, 'g')
    const domainOnlyPattern = new RegExp(`${host}`, 'g')
    result = result.replace(httpsPattern, '')
    result = result.replace(httpPattern, '')
    result = result.replace(domainOnlyPattern, '')
    const firstChar = result[0]
    if(firstChar != '/') return null
    return result
  }

  getNginxConfigContent() {
    return `# 此檔案僅建立301 redirect規則區段
# 請自行擷取需要使用的部份使用

set $web_host '${this.newHost}';

location / {
    ${this.redirectRulesContent}
    index index.html;
}`
  }
}

nginxRedirectConfig.description = `建立Nginx 301 Redirect規則設定檔`

nginxRedirectConfig.flags = {
  path: flags.string({
    required: true,
    char: 'p',
    description: `
Excel檔案路徑(${chalk.hex(COLOR.ORANGE_HEX)('檔案格式必須如下')})
${chalk.hex(COLOR.ORANGE_HEX)('origin: 舊站網址')}
${chalk.hex(COLOR.ORANGE_HEX)('new: 新站網址')}

|-------------------------------------|-------------------------------------|
|                origin               |                 new                 |
|-------------------------------------|-------------------------------------|
|    http://foobar.com/article/123    |     https://example.com/page/ABC    |
|    http://foobar.com/article/XXX    |     https://example.com/page/111    |
|-------------------------------------|-------------------------------------|
`,
  }),
  output: flags.string({
    required: true,
    char: 'o',
    description: `
Nginx規則檔案輸出路徑
    `,
  }),
  originHost: flags.string({
    required: true,
    description: '原始網域',
  }),
  newHost: flags.string({
    required: true,
    description: '新網域(建立nginx redirect變數用)',
  }),
  debug: flags.boolean({
    description: 'debug mode',
    default: false,
  }),
}

module.exports = nginxRedirectConfig
