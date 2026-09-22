import { getActionConfig } from '../setup/utils.js'

const ruleName = 'boundary-intersection-consent-required'

const caveatCodeForLayer = {
  sssi: 'ne-consent-required',
  historic_features: 'hefer-consent-required'
}

const usesBoundaryIntersection = (rule) => (rule.type ?? rule.name) === ruleName

const actionsUsingBoundaryIntersection = (configFiles) =>
  configFiles.filter((config) => config.rules?.some(usesBoundaryIntersection))

const boundaryRules = (config) => config.rules.filter(usesBoundaryIntersection)

describe('boundary intersection consent required', () => {
  let configs

  beforeAll(async () => {
    configs = actionsUsingBoundaryIntersection(await getActionConfig())
  })

  test('should only be configured on actions measured in metres', () => {
    for (const config of configs) {
      expect(config.applicationUnitOfMeasurement).toEqual('m')
    }
  })

  test('should name a layer the engine measures boundary intersections for', () => {
    for (const config of configs) {
      for (const rule of boundaryRules(config)) {
        expect(Object.keys(caveatCodeForLayer)).toContain(
          rule.config?.layerName
        )
      }
    }
  })

  test('should raise the same caveat code as the area rule for its layer', () => {
    for (const config of configs) {
      for (const rule of boundaryRules(config)) {
        expect(rule.config?.caveatCode).toEqual(
          caveatCodeForLayer[rule.config?.layerName]
        )
      }
    }
  })

  test('should configure a farmer-facing caveat description', () => {
    for (const config of configs) {
      for (const rule of boundaryRules(config)) {
        expect(rule.config?.caveatDescription).toEqual(expect.any(String))
        expect(rule.config.caveatDescription.trim()).not.toEqual('')
      }
    }
  })

  test('should configure a tolerance in whole non-negative metres', () => {
    for (const config of configs) {
      for (const rule of boundaryRules(config)) {
        const { toleranceMeters } = rule.config ?? {}

        expect(Number.isInteger(toleranceMeters)).toBe(true)
        expect(toleranceMeters).toBeGreaterThanOrEqual(0)
      }
    }
  })
})
