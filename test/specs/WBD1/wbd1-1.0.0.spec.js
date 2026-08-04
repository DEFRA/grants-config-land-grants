import { describe, beforeAll, it, expect } from 'vitest'
import { publishConfig } from '../../setup/publish-config.js'
import { apiClient } from '../../setup/api-client.js'

// Requires land-grants-api commits e4cd344f (count-based unit support in the
// available-area calculation) and 47d8fc59 (generic manual-check-required rule)

const CODE = 'WBD1'
const VERSION = '1.0.0'
const RATE_PENCE_PER_COUNT = 25700
const PARCEL = { sheetId: 'SD5649', parcelId: '9215' }

describe(`${CODE} @ ${VERSION}`, () => {
  beforeAll(async () => {
    await publishConfig({ code: CODE, semanticVersion: VERSION })
  })

  it('payments/calculate returns the configured rate', async () => {
    const response = await apiClient.post('/api/v2/payments/calculate', {
      startDate: '2025-09-15',
      parcel: [{ ...PARCEL, actions: [{ code: CODE, quantity: 1 }] }]
    })

    expect(response.status).toBe(200)
    expect(Object.values(response.body.payment.parcelItems)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: CODE,
          version: VERSION,
          annualPaymentPence: RATE_PENCE_PER_COUNT
        })
      ])
    )
  })

  it('application/validate accepts the config and attaches the pond-check-required caveat', async () => {
    const response = await apiClient.post('/api/v2/application/validate', {
      applicationId: 'test-application-1',
      requester: 'test-requester',
      applicantCrn: '1234567890',
      sbi: 123456789,
      landActions: [{ ...PARCEL, actions: [{ code: CODE, quantity: 1 }] }]
    })

    expect(response.status).toBe(200)
    expect(response.body.actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          actionCode: CODE,
          version: VERSION,
          rules: expect.arrayContaining([
            expect.objectContaining({
              name: 'pond-check-required',
              passed: true,
              caveat: expect.objectContaining({
                code: 'pond-check-required',
                description: 'A manual pond check is required',
                metadata: expect.objectContaining({
                  actionCode: CODE,
                  sheetId: PARCEL.sheetId,
                  parcelId: PARCEL.parcelId
                })
              })
            })
          ])
        })
      ])
    )
  })
})
