import { glob, readFile } from 'node:fs/promises'
import { actionConfigSchema } from './actionConfigSchema.js'

async function getConfigFiles() {
  const files = []
  for await (const file of glob('configurations/**/*.json')) {
    files.push({ file, config: JSON.parse(await readFile(file, 'utf8')) })
  }
  return files
}

describe('action config schema', () => {
  let configFiles

  beforeAll(async () => {
    configFiles = await getConfigFiles()
  })

  test('found config files to validate', () => {
    expect(configFiles.length).toBeGreaterThan(0)
  })

  test('every action config file matches the schema', () => {
    for (const { file, config } of configFiles) {
      const { error } = actionConfigSchema.validate(config, {
        abortEarly: false
      })
      expect(error, `${file}: ${error?.message}`).toBeUndefined()
    }
  })
})
