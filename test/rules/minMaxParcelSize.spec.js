import { describe, expect } from 'vitest'
import { getActionConfig } from '../setup/utils.js'

const ruleName = 'min-max-parcel-size-1.0.0'

describe('minMaxParcelSize', () => {
  let configFiles

  beforeAll(async () => {
    configFiles = await getActionConfig()
  })

  test('config is valid', async () => {
    for (const config of configFiles) {
      expect(config).not.toBeNull()
      const ruleConfig = config.rules.find((r) => r.name === ruleName)
      if (ruleConfig) {
        const { minimumParcelSizeSqm, maximumParcelSizeSqm } = ruleConfig.config
        if (minimumParcelSizeSqm && maximumParcelSizeSqm) {
          expect(minimumParcelSizeSqm).toBeLessThan(maximumParcelSizeSqm)
        }
        expect(
          minimumParcelSizeSqm ?? maximumParcelSizeSqm ?? null
        ).not.toBeNull()
      }
    }
  })
})
