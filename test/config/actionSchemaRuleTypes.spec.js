import { loadAction } from '../setup/utils.js'

const ruleNamed = (config, ruleName) =>
  config.rules.find(({ name }) => name === ruleName)

const areaAction = ['UPL1', 'upl1-3.3.0.json']
const linearAction = ['BND2_26', 'bnd2_26-1.1.0.json']
const countAction = ['WBD1_26', 'wbd1_26-1.0.0.json']

describe('action schema rule types', () => {
  test.each([
    [
      'an area consent rule configured in metres',
      areaAction,
      (c) => {
        const rule = ruleNamed(c, 'sssi-consent-required')
        delete rule.config.tolerancePercent
        rule.config.toleranceMeters = 1
      },
      '.config.tolerancePercent" is required'
    ],
    [
      'a boundary consent rule configured as a percentage',
      linearAction,
      (c) => {
        ruleNamed(c, 'sssi-consent-required').config.tolerancePercent = 0
      },
      '.config.tolerancePercent" is not allowed'
    ],
    [
      'a boundary consent rule without a caveat code',
      linearAction,
      (c) => {
        delete ruleNamed(c, 'hefer-consent-required').config.caveatCode
      },
      '.config.caveatCode" is required'
    ],
    [
      'a rule type the rules engine does not know',
      linearAction,
      (c) => {
        ruleNamed(c, 'sssi-consent-required').type =
          'boundary-intersection-consnet-required'
      },
      '.type" must be one of ['
    ],
    [
      'a manual check without its type',
      countAction,
      (c) => {
        delete ruleNamed(c, 'pond-check-required').type
      },
      '.type" is required'
    ],
    [
      'a manual check without a caveat description',
      countAction,
      (c) => {
        delete ruleNamed(c, 'pond-check-required').config.caveatDescription
      },
      '.config.caveatDescription" is required'
    ]
  ])('rejects %s', async (_, action, mutate, message) => {
    const { schema, config } = await loadAction(...action)
    mutate(config)

    const { error } = schema.validate(config)

    expect(error?.message).toContain(message)
  })
})
