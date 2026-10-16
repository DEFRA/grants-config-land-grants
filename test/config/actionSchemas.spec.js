import { glob, readFile } from 'node:fs/promises'
import path from 'node:path'

const actionsDir = 'configurations/land-grants/actions_config'

const compareVersions = (a, b) =>
  a.localeCompare(b, undefined, { numeric: true })

async function getActions() {
  const actions = []
  for await (const dir of glob(`${actionsDir}/*/`)) {
    const code = path.basename(dir)
    const files = []
    for await (const file of glob(`${dir}/*.json`)) {
      files.push(file)
    }
    actions.push({ code, dir, files })
  }
  return actions
}

describe('action config schemas', async () => {
  const actions = await getActions()

  test.each(actions.map(({ code }) => code))(
    '%s has a schema',
    async (code) => {
      const { default: schema } = await import(
        path.resolve(actionsDir, code, 'schema.js')
      )
      expect(schema).toBeDefined()
    }
  )

  describe.each(actions)('$code', ({ code, dir, files }) => {
    let schema

    beforeAll(async () => {
      schema = (await import(path.resolve(dir, 'schema.js'))).default
    })

    test.each(files)('%s is valid', async (file) => {
      const config = JSON.parse(await readFile(file, 'utf8'))
      const { error } = schema.validate(config, { abortEarly: false })
      expect(error?.message).toBeUndefined()
    })

    test('start dates never go backwards between versions', async () => {
      const configs = await Promise.all(
        files.map(async (file) => JSON.parse(await readFile(file, 'utf8')))
      )
      const startDates = configs
        .sort((a, b) => compareVersions(a.semanticVersion, b.semanticVersion))
        .map(({ startDate }) => startDate)
      expect(startDates).toEqual([...startDates].sort())
    })

    test.each(files)('%s filename matches code and version', async (file) => {
      const { semanticVersion } = JSON.parse(await readFile(file, 'utf8'))
      expect(path.basename(file)).toBe(
        `${code.toLowerCase()}-${semanticVersion}.json`
      )
    })
  })
})
