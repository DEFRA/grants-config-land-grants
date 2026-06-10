import { describe, beforeAll, it, expect } from 'vitest'
import { publishConfig } from '../../setup/publish-config.js'
import { apiClient } from '../../setup/api-client.js'

const CODE = 'CLIG3'
const VERSION = '1.1.0'
const RATE_PENCE_PER_HA = 16500

describe(`${CODE} @ ${VERSION}`, () => {
  beforeAll(async () => {
    await publishConfig({ code: CODE, semanticVersion: VERSION })
  })

  it('payments/calculate returns the configured rate', async () => {
    const response = await apiClient.post('/api/v2/payments/calculate', {
      startDate: '2025-09-15',
      parcel: [
        {
          sheetId: 'SD6743',
          parcelId: '8083',
          actions: [{ code: CODE, quantity: 1 }]
        }
      ]
    })

    expect(response.status).toBe(200)
    expect(Object.values(response.body.payment.parcelItems)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: CODE, version: VERSION, annualPaymentPence: RATE_PENCE_PER_HA })
      ])
    )
  })
})
