import { describe, beforeAll, it, expect } from 'vitest'
import { publishConfig } from '../../setup/publish-config.js'
import { apiClient } from '../../setup/api-client.js'

const CODE = 'CSAM3'
const VERSION = '1.1.0'
const RATE_PENCE_PER_HA = 22400
const PARCEL = { sheetId: 'SD6743', parcelId: '8083' }

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
          annualPaymentPence: RATE_PENCE_PER_HA
        })
      ])
    )
  })

  it('application/validate accepts the config', async () => {
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
        expect.objectContaining({ actionCode: CODE, version: VERSION })
      ])
    )
  })

  describe('pinned to an older version', () => {
    const OLD_VERSION = '1.0.0'

    beforeAll(async () => {
      await publishConfig({ code: CODE, semanticVersion: OLD_VERSION })
    })

    it('payments/calculate returns the pinned version', async () => {
      const response = await apiClient.post('/api/v2/payments/calculate', {
        startDate: '2025-09-15',
        parcel: [
          {
            ...PARCEL,
            actions: [{ code: CODE, quantity: 1, version: OLD_VERSION }]
          }
        ]
      })

      expect(response.status).toBe(200)
      expect(Object.values(response.body.payment.parcelItems)).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: CODE,
            version: OLD_VERSION,
            annualPaymentPence: RATE_PENCE_PER_HA
          })
        ])
      )
    })

    it('application/validate returns the pinned version', async () => {
      const response = await apiClient.post('/api/v2/application/validate', {
        applicationId: 'test-application-1',
        requester: 'test-requester',
        applicantCrn: '1234567890',
        sbi: 123456789,
        landActions: [
          {
            ...PARCEL,
            actions: [{ code: CODE, quantity: 1, version: OLD_VERSION }]
          }
        ]
      })

      expect(response.status).toBe(200)
      expect(response.body.actions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ actionCode: CODE, version: OLD_VERSION })
        ])
      )
    })
  })
})
