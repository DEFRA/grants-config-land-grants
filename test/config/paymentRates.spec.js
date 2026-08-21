import { getActionConfig } from '../setup/utils.js'

describe('payment rates', () => {
  test('should have matching values', async () => {
    const configFiles = await getActionConfig()
    for (const config of configFiles) {
      const { payment, paymentMethod } = config

      if (!payment || !paymentMethod?.config) continue

      for (const field of ['ratePerUnitGbp', 'ratePerAgreementPerYearGbp']) {
        const topLevel = payment[field]
        const nested = paymentMethod.config[field]
        if (topLevel === undefined && nested === undefined) continue
        expect(topLevel).toEqual(nested)
      }
    }
  })
})
