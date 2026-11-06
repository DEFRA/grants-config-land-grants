import { glob, readFile } from 'node:fs/promises'
import { parse } from 'csv-parse/sync'

const configDir = 'configurations/land-grants'

const filesIn = async (dir) => {
  const files = []
  for await (const file of glob(`${configDir}/${dir}/*.csv`)) files.push(file)
  return files.sort()
}

const readCsv = async (file) => parse(await readFile(file, 'utf8'))

const compatibilityMatrixFiles = await filesIn('compatibility_matrix')

describe('compatibility matrix', () => {
  test('has one versioned file', () => {
    expect(compatibilityMatrixFiles).have.length(1)
  })

  describe.each(compatibilityMatrixFiles)('%s', (file) => {
    let records

    beforeAll(async () => {
      records = await readCsv(file)
    })

    test('has the expected header', () => {
      expect(records[0]).toEqual([
        'option_code',
        'option_code_compat',
        'type',
        'year'
      ])
    })
  })

  test('has records from compatibility matrix with type', async () => {
    const records = await readCsv(compatibilityMatrixFiles[0])

    expect(
      records.some((f) => {
        const [optionCode, optionCodeCompat, type, year] = f
        return (
          optionCode === 'AB1' &&
          optionCodeCompat === 'AB4' &&
          type === 'BASECO' &&
          year === '2024'
        )
      })
    ).toBe(true)
  })

  test('has records from supplemental compatibility matrix', async () => {
    const records = await readCsv(compatibilityMatrixFiles[0])

    expect(
      records.some((f) => {
        const [optionCode, optionCodeCompat, type, year] = f
        return (
          optionCode === 'TE3' &&
          optionCodeCompat === 'BE3' &&
          type === 'ELCPRV' &&
          year === '2026'
        )
      })
    ).toBe(true)
  })
})
