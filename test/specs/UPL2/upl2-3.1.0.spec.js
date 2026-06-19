import { describe, beforeAll, it, expect } from 'vitest'
import { publishConfig } from '../../setup/publish-config.js'
import { apiClient } from '../../setup/api-client.js'

const CODE = 'UPL2'
const VERSION = '3.1.0'
const RATE_PENCE_PER_HA = 8900
const OLD_RATE_PENCE_PER_HA = 5300
const OLD_VERSIONS = ['1.0.0', '2.0.0', '3.0.0']
const PARCEL = { sheetId: 'SD7247', parcelId: '8028' }

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

  describe.each(OLD_VERSIONS)('pinned to version %s', (oldVersion) => {
    beforeAll(async () => {
      await publishConfig({ code: CODE, semanticVersion: oldVersion })
    })

    it('payments/calculate returns the pinned version', async () => {
      const response = await apiClient.post('/api/v2/payments/calculate', {
        startDate: '2025-09-15',
        parcel: [
          {
            ...PARCEL,
            actions: [{ code: CODE, quantity: 1, version: oldVersion }]
          }
        ]
      })

      expect(response.status).toBe(200)
      expect(Object.values(response.body.payment.parcelItems)).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: CODE,
            version: oldVersion,
            annualPaymentPence: OLD_RATE_PENCE_PER_HA
          })
        ])
      )
    })

    it('application/validate returns the pinned version', async () => {
      const response = await apiClient.post('/api/v2/application/validate', {
        applicationId: `test-application-${CODE}-pin-${oldVersion}`,
        requester: 'test-requester',
        applicantCrn: '1234567890',
        sbi: 123456789,
        landActions: [
          {
            ...PARCEL,
            actions: [{ code: CODE, quantity: 1, version: oldVersion }]
          }
        ]
      })

      expect(response.status).toBe(200)
      expect(response.body.actions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ actionCode: CODE, version: oldVersion })
        ])
      )
    })
  })
})
