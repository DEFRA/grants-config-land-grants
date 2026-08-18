import { describe, beforeAll, it, expect } from 'vitest'
import { publishConfig } from '../../setup/publish-config.js'
import { apiClient } from '../../setup/api-client.js'

const CODE = 'SCR2'
const VERSION = '1.1.0'
const RATE_PENCE_PER_HA = 35000
const PARCEL = { sheetId: 'SD6743', parcelId: '8083' }

describe(`${CODE} @ ${VERSION}`, () => {
  beforeAll(async () => {
    await publishConfig({ code: CODE, semanticVersion: VERSION })
  })

  it('payments/calculate returns the configured rate', async () => {
    const response = await apiClient.post('/api/v2/payments/calculate', {
      startDate: '2026-09-20',
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
      sbi: '123456789',
      landActions: [{ ...PARCEL, actions: [{ code: CODE, quantity: 1 }] }]
    })

    expect(response.status).toBe(200)
    expect(response.body.actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ actionCode: CODE, version: VERSION })
      ])
    )
  })

  it('parcels returns the configured guidanceUrl and availability', async () => {
    const response = await apiClient.post('/api/v2/parcels', {
      sbi: '123456789',
      parcelIds: [`${PARCEL.sheetId}-${PARCEL.parcelId}`],
      fields: ['actions']
    })

    expect(response.status).toBe(200)
    expect(response.body.parcels[0].actions).toContainEqual(
      expect.objectContaining({
        code: CODE,
        guidanceUrl:
          'https://www.gov.uk/find-funding-for-land-or-farms/scr2-manage-scrub-and-open-habitat-mosaics',
        availability: expect.objectContaining({ type: 'partial' })
      })
    )
  })
})
