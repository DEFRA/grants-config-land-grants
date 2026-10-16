import { glob, readFile } from 'node:fs/promises'
import { parse } from 'csv-parse/sync'

const mappingFile = 'configurations/land-grants/actions/actions_mapping.csv'
const actionsConfigDir = 'configurations/land-grants/actions_config'

// land-grants-api loads this with Postgres COPY (FORMAT csv, HEADER true) into
// a positional temp table - action_code, sssi_eligible, hf_eligible - so column
// order is the contract, not the names. Parse as strictly as COPY does: no
// trimming, and a blank line anywhere (even at the end) fails the import.
const toRow = ([actionCode, sssiEligible, hfEligible]) => ({
  actionCode,
  sssiEligible,
  hfEligible
})

const legacyCodeFor = (actionCode) => actionCode.replace(/_26$/, '')

describe('actions mapping', () => {
  let records
  let rows

  const rowFor = (actionCode) =>
    rows.find((row) => row.actionCode === actionCode)

  beforeAll(async () => {
    // Throws on a blank line or a row without exactly three columns
    records = parse(await readFile(mappingFile, 'utf8'))
    rows = records.slice(1).map(toRow)
  })

  test('is the only non-JSON, non-schema file under configurations', async () => {
    const files = []
    for await (const file of glob('configurations/**/*.*')) {
      const isSchema = /(^|\/)schemas?(\/|\.js$)/.test(file)
      if (!file.endsWith('.json') && !isSchema) files.push(file)
    }

    expect(files).toEqual([mappingFile])
  })

  test('has the expected header', () => {
    expect(records[0]).toEqual(['action_code', 'has_sssi', 'has_hf'])
  })

  // COPY keeps surrounding whitespace, so ' UPL1' would silently match no action
  test('has no whitespace around any value', () => {
    expect(records.flat().filter((value) => value !== value.trim())).toEqual([])
  })

  test('holds one row per action code', () => {
    const codes = rows.map((row) => row.actionCode)

    expect(codes).toHaveLength(new Set(codes).size)
  })

  test('records each eligibility as 0 or 1', () => {
    const values = rows.flatMap((row) => [row.sssiEligible, row.hfEligible])

    expect(values.filter((value) => value !== '0' && value !== '1')).toEqual([])
  })

  test.each([
    'CLIG3_26',
    'CNUM2_26',
    'CSAM3_26',
    'SCR2_26',
    'UPL1_26',
    'UPL2_26',
    'UPL3_26',
    'UPL8_26',
    'UPL10_26',
    'WBD1_26'
  ])('%s inherits the eligibility of its legacy counterpart', (actionCode) => {
    const legacy = rowFor(legacyCodeFor(actionCode))

    expect(rowFor(actionCode)).toEqual({
      actionCode,
      sssiEligible: legacy.sssiEligible,
      hfEligible: legacy.hfEligible
    })
  })

  test('every _26 row with a legacy counterpart matches it', () => {
    const mismatched = rows
      .filter((row) => row.actionCode.endsWith('_26'))
      .filter((row) => {
        const legacy = rowFor(legacyCodeFor(row.actionCode))
        return (
          legacy &&
          (legacy.sssiEligible !== row.sssiEligible ||
            legacy.hfEligible !== row.hfEligible)
        )
      })

    expect(mismatched).toEqual([])
  })

  // A missing row silently defaults to eligible on SSSI and HF land, so every
  // action config must state its eligibility explicitly. land-grants-api keys
  // the action on the code inside the JSON, not the folder it sits in.
  test('every action config has a row for its code', async () => {
    const unmapped = []
    for await (const file of glob(`${actionsConfigDir}/**/*.json`)) {
      const { code } = JSON.parse(await readFile(file, 'utf8'))
      if (!rowFor(code)) unmapped.push(`${code} (${file})`)
    }

    expect(unmapped).toEqual([])
  })
})
