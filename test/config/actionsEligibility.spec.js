import { glob, readFile } from 'node:fs/promises'
import { parse } from 'csv-parse/sync'
import { getLatestActionConfig, isLinearAction } from '../setup/utils.js'

const eligibilityFile =
  'configurations/land-grants/actions/actions_eligibility.csv'
const actionsConfigDir = 'configurations/land-grants/actions_config'

const SIDEDNESS_VALUES = ['single-side', 'both-sides']

// land-grants-api loads this with Postgres COPY (FORMAT csv, HEADER true) into
// a positional temp table - action_code, sssi_eligible, hf_eligible, sidedness -
// so column order is the contract, not the names. Parse as strictly as COPY
// does: no trimming, and a blank line anywhere (even at the end) fails the import.
// A blank sidedness loads as NULL.
const toRow = ([actionCode, sssiEligible, hfEligible, sidedness]) => ({
  actionCode,
  sssiEligible,
  hfEligible,
  sidedness
})

const legacyCodeFor = (actionCode) => actionCode.replace(/_26$/, '')

describe('actions eligibility', () => {
  let records
  let rows

  const rowFor = (actionCode) =>
    rows.find((row) => row.actionCode === actionCode)

  beforeAll(async () => {
    // Throws on a blank line or a row without exactly four columns
    records = parse(await readFile(eligibilityFile, 'utf8'))
    rows = records.slice(1).map(toRow)
  })

  test('is the only non-JSON file under configurations', async () => {
    const files = []
    for await (const file of glob('configurations/**/*.*')) {
      if (!file.endsWith('.json')) files.push(file)
    }

    expect(files).toEqual([eligibilityFile])
  })

  test('has the expected header', () => {
    expect(records[0]).toEqual([
      'action_code',
      'has_sssi',
      'has_hf',
      'sidedness'
    ])
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

  test('records each sidedness as single-side, both-sides or blank', () => {
    expect(
      rows.filter(
        (row) => row.sidedness && !SIDEDNESS_VALUES.includes(row.sidedness)
      )
    ).toEqual([])
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
    const { sssiEligible, hfEligible } = rowFor(actionCode)

    expect({ sssiEligible, hfEligible }).toEqual({
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

  test.each(['BND1', 'BND1_26', 'WBD2'])('%s is both-sides', (actionCode) => {
    expect(rowFor(actionCode).sidedness).toBe('both-sides')
  })

  test.each(['BND2', 'BND2_26'])('%s is single-side', (actionCode) => {
    expect(rowFor(actionCode).sidedness).toBe('single-side')
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

  test('every linear action config has a sidedness', async () => {
    const actionConfigs = await getLatestActionConfig()

    const missing = actionConfigs
      .filter(isLinearAction)
      .filter((config) => !rowFor(config.code)?.sidedness)
      .map((config) => config.code)

    expect(missing, 'sidedness is required for linear actions').toEqual([])
  })

  test('no other action config has a sidedness', async () => {
    const actionConfigs = await getLatestActionConfig()

    const sided = actionConfigs
      .filter((config) => !isLinearAction(config))
      .filter((config) => rowFor(config.code)?.sidedness)
      .map((config) => config.code)

    expect(sided, 'sidedness is only for linear actions').toEqual([])
  })
})
