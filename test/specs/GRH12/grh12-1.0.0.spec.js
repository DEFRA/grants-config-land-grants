import { describe, beforeAll, it, expect } from 'vitest'
import { publishConfig } from '../../setup/publish-config.js'
import { apiClient } from '../../setup/api-client.js'

const CODE = 'GRH12'
const VERSION = '1.0.0'
const PARCEL = { sheetId: 'SD6743', parcelId: '8083' }

describe(`${CODE} @ ${VERSION}`, () => {
  beforeAll(async () => {
    await publishConfig({ code: CODE, semanticVersion: VERSION })
  })

  it('payments/calculate returns 400 as config is disabled', async () => {
    const response = await apiClient.post('/api/v2/payments/calculate', {
      startDate: '2026-10-18',
      parcel: [
        { ...PARCEL, actions: [{ code: CODE, quantity: 1, version: VERSION }] }
      ]
    })

    expect(response.status).toBe(400)
  })
})
