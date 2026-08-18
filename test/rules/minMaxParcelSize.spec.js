import { describe, expect } from 'vitest'
import { getActionConfig } from '../setup/utils.js'

const ruleName = 'min-max-parcel-size-1.0.0'

describe('minMaxParcelSize', () => {

  let configFiles;

  beforeAll(async () => {
    configFiles = await getActionConfig()
  })

  test('config is valid', async () => {
    for (const config of configFiles) {
      expect(config).not.toBeNull()
      const ruleConfig = config.rules.find((r) => r.name === ruleName)
      if (ruleConfig) {
        const { minimumParcelSizeHa, maximumParcelSizeHa } = ruleConfig.config
        if (minimumParcelSizeHa && maximumParcelSizeHa) {
          expect(minimumParcelSizeHa).toBeLessThan(maximumParcelSizeHa)
        }
      }
    }
  })

})
