import { readFile, glob } from 'node:fs/promises'

describe('payment rates', () => {
  test('should have matching values', async () => {
    for await (const file of glob('configurations/**/*.json')) {
      const config = JSON.parse(await readFile(file, 'utf8'))
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
