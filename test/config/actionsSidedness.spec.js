import { readFile } from 'node:fs/promises'
import { parse } from 'csv-parse/sync'
import { getLatestActionConfig } from '../setup/utils.js'

const sidednessFile = 'configurations/land-grants/actions/actions_sidedness.csv'
const mappingFile = 'configurations/land-grants/actions/actions_mapping.csv'

const SIDEDNESS_VALUES = ['single-side', 'both-sides']

// land-grants-api loads this with Postgres COPY (FORMAT csv, HEADER true) into
// a positional temp table - action_code, sidedness - so column order is the
// contract, not the names. Parse as strictly as COPY does: no trimming, and a
// blank line anywhere (even at the end) fails the import.
const toRow = ([actionCode, sidedness]) => ({ actionCode, sidedness })

describe('actions sidedness', () => {
  let records
  let rows

  const sidednessOf = (actionCode) =>
    rows.find((row) => row.actionCode === actionCode)?.sidedness

  beforeAll(async () => {
    // Throws on a blank line or a row without exactly two columns
    records = parse(await readFile(sidednessFile, 'utf8'))
    rows = records.slice(1).map(toRow)
  })

  test('has the expected header', () => {
    expect(records[0]).toEqual(['action_code', 'sidedness'])
  })

  // COPY keeps surrounding whitespace, so ' BND1' would silently match no action
  test('has no whitespace around any value', () => {
    expect(records.flat().filter((value) => value !== value.trim())).toEqual([])
  })

  test('holds one row per action code', () => {
    const codes = rows.map((row) => row.actionCode)

    expect(codes).toHaveLength(new Set(codes).size)
  })

  // A code with no sidedness has no row, so a blank is never valid
  test('records each sidedness as single-side or both-sides', () => {
    expect(
      rows.filter((row) => !SIDEDNESS_VALUES.includes(row.sidedness))
    ).toEqual([])
  })

  test.each(['BND1', 'BND1_26', 'WBD2'])('%s is both-sides', (actionCode) => {
    expect(sidednessOf(actionCode)).toBe('both-sides')
  })

  test.each(['BND2', 'BND2_26'])('%s is single-side', (actionCode) => {
    expect(sidednessOf(actionCode)).toBe('single-side')
  })

  // land-grants-api keys the action on the code inside the JSON, not the folder it sits in
  test('every linear action config has a row for its code', async () => {
    const actionConfigs = await getLatestActionConfig()

    const missing = actionConfigs
      .filter((config) => config.applicationUnitOfMeasurement === 'm')
      .filter((config) => !sidednessOf(config.code))
      .map((config) => config.code)

    expect(missing, 'sidedness is required for linear actions').toEqual([])
  })

  // actions_mapping.csv is the register of action codes, and land-grants-api only
  // updates rows that exist, so a code outside it would silently do nothing
  test('every code is in the actions mapping', async () => {
    const actionMappings = await readFile(mappingFile, 'utf8')

    const actionMappingCodes = new Set(
      parse(actionMappings)
        .slice(1)
        .map(([actionCode]) => actionCode)
    )

    const missingActionCodes = rows
      .map((row) => row.actionCode)
      .filter((actionCode) => !actionMappingCodes.has(actionCode))

    expect(missingActionCodes).toEqual([])
  })
})
