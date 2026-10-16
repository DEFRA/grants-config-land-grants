import { readFile } from 'node:fs/promises'
import schema from '../../configurations/land-grants/actions_config/UPL1/schema.js'

const validConfig = JSON.parse(
  await readFile(
    'configurations/land-grants/actions_config/UPL1/upl1-3.3.0.json',
    'utf8'
  )
)

const sssiRule = (config) =>
  config.rules.find(({ name }) => name === 'sssi-consent-required')

describe('action config schema rejections', () => {
  test('accepts the valid base config', () => {
    expect(schema.validate(validConfig).error).toBeUndefined()
  })

  test.each([
    [
      'an unknown top-level field',
      (c) => {
        c.durationYear = 1
      },
      '"durationYear" is not allowed'
    ],
    [
      'a code that does not match the action',
      (c) => {
        c.code = 'UPL2'
      },
      '"code" must be [UPL1]'
    ],
    [
      'an invalid start date',
      (c) => {
        c.startDate = 'soon'
      },
      '"startDate" must be in ISO 8601 date format'
    ],
    [
      'a negative rate',
      (c) => {
        c.paymentMethod.config.ratePerUnitGbp = -1
      },
      '"paymentMethod.config.ratePerUnitGbp" must be greater than or equal to 0'
    ],
    [
      'a payment rate that differs from the payment method',
      (c) => {
        c.payment.ratePerUnitGbp = 99
      },
      '"payment.ratePerUnitGbp" must be [ref:root:paymentMethod.config.ratePerUnitGbp]'
    ],
    [
      'a rule the action does not allow',
      (c) => {
        c.rules.push({
          name: 'minimum-length',
          description: 'x',
          config: { minimumLengthM: 5 }
        })
      },
      '"rules[4].name" must be one of'
    ],
    [
      'a duplicated rule',
      (c) => {
        c.rules.push(structuredClone(c.rules[0]))
      },
      '"rules[4]" contains a duplicate value'
    ],
    [
      'a rule config missing a required field',
      (c) => {
        delete sssiRule(c).config.caveatDescription
      },
      '"rules[2].config.caveatDescription" is required'
    ],
    [
      'an unknown rule config field',
      (c) => {
        sssiRule(c).config.layerNme = 'sssi'
      },
      '"rules[2].config.layerNme" is not allowed'
    ],
    [
      'a layer name that does not belong to the rule',
      (c) => {
        sssiRule(c).config.layerName = 'moorland'
      },
      '"rules[2].config.layerName" must be [sssi]'
    ],
    [
      'config on a rule that takes none',
      (c) => {
        c.rules[1].config = { layerName: 'moorland' }
      },
      '"rules[1].config" is not allowed'
    ]
  ])('rejects %s', (_, mutate, message) => {
    const config = structuredClone(validConfig)
    mutate(config)

    const { error } = schema.validate(config)

    expect(error.message).toContain(message)
  })
})
