import { readFile } from 'node:fs/promises'
import path from 'node:path'

const actionsDir = 'configurations/land-grants/actions_config'

const loadAction = async (code, file) => {
  const { default: schema } = await import(
    path.resolve(actionsDir, code, 'schema.js')
  )
  const config = JSON.parse(
    await readFile(path.join(actionsDir, code, file), 'utf8')
  )
  return { schema, config }
}

const kinds = {
  area: {
    action: ['UPL1', 'upl1-3.3.0.json'],
    accepted: ['ha', 'sqm'],
    rejected: ['m', 'count'],
    message: '"applicationUnitOfMeasurement" must be one of [ha, sqm]'
  },
  linear: {
    action: ['BND1', 'bnd1-1.0.0.json'],
    accepted: ['m'],
    rejected: ['ha', 'sqm', 'count'],
    message: '"applicationUnitOfMeasurement" must be [m]'
  },
  count: {
    action: ['WBD1', 'wbd1-1.3.0.json'],
    accepted: ['count'],
    rejected: ['ha', 'sqm', 'm'],
    message: '"applicationUnitOfMeasurement" must be [count]'
  }
}

const cases = (outcome) =>
  Object.entries(kinds).flatMap(([kind, spec]) =>
    spec[outcome].map((unit) => [kind, unit, spec])
  )

describe('action schema units of measurement', () => {
  test.each(cases('accepted'))(
    'a %s action accepts %s',
    async (_, unit, { action }) => {
      const { schema, config } = await loadAction(...action)
      config.applicationUnitOfMeasurement = unit

      const { error } = schema.validate(config)

      expect(error).toBeUndefined()
    }
  )

  test.each(cases('rejected'))(
    'a %s action rejects %s',
    async (_, unit, { action, message }) => {
      const { schema, config } = await loadAction(...action)
      config.applicationUnitOfMeasurement = unit

      const { error } = schema.validate(config)

      expect(error?.message).toBe(message)
    }
  )
})
