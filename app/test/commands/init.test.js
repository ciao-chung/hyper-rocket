const {expect, test} = require('@oclif/test')

describe('hooks', () => {
  test
  .stdout()
  .hook('init', { id: 'init-hook' })
  .do(output => expect(output.stdout).to.contain('HYPER ROCKET is launching now'))
  .it('test init hook')
})
