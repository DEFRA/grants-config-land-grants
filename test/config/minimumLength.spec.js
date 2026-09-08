import { getActionConfig } from '../setup/utils.js'

const ruleName = 'minimum-length'

const usesMinimumLength = (rule) => (rule.type ?? rule.name) === ruleName

const actionsUsingMinimumLength = (configFiles) =>
  configFiles.filter((config) => config.rules?.some(usesMinimumLength))

describe('minimum length', () => {
  test('should configure a minimum length in whole metres', async () => {
    const configs = actionsUsingMinimumLength(await getActionConfig())

    for (const config of configs) {
      const minimumLengthM =
        config.rules.find(usesMinimumLength).config?.minimumLengthM

      expect(minimumLengthM).toBeDefined()
      expect(Number.isInteger(minimumLengthM)).toBe(true)
      expect(minimumLengthM).toBeGreaterThan(0)
    }
  })

  test('should only be configured on actions measured in metres', async () => {
    const configs = actionsUsingMinimumLength(await getActionConfig())

    for (const config of configs) {
      expect(config.applicationUnitOfMeasurement).toEqual('m')
    }
  })
})
