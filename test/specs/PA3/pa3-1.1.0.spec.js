import { describe, it } from 'vitest'
import { publishConfig } from '../../setup/publish-config.js'

const CODE = 'PA3'
const VERSION = '1.1.0'

// PA3 uses wmp-calculation with tiered rates that depend on woodland area in the
// parcel. The payment assertion is deferred until woodland parcels are wired in
// from land-grants-api-tests. This spec verifies config ingestion only.
describe(`${CODE} @ ${VERSION}`, () => {
  it('config is published and ingested without error', async () => {
    await publishConfig({ code: CODE, semanticVersion: VERSION })
  })
})
