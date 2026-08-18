import { describe, beforeAll, it, expect } from 'vitest'
import { publishConfig } from '../../setup/publish-config.js'
import { apiClient } from '../../setup/api-client.js'

const CODE = 'HEF1'
const VERSION = '1.0.0'
const RATE_PENCE_PER_SQM = 500
const PARCEL = { sheetId: 'SD5649', parcelId: '9215' }

describe(`${CODE} @ ${VERSION}`, () => {
  beforeAll(async () => {
    await publishConfig({ code: CODE, semanticVersion: VERSION })
  })

  it('payments/calculate returns the configured rate per sqm', async () => {
    const quantity = 200
    const response = await apiClient.post('/api/v2/payments/calculate', {
      startDate: '2026-10-18',
      parcel: [{ ...PARCEL, actions: [{ code: CODE, quantity }] }]
    })

    expect(response.status).toBe(200)
    expect(Object.values(response.body.payment.parcelItems)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: CODE,
          version: VERSION,
          unit: 'sqm',
          quantity,
          rateInPence: RATE_PENCE_PER_SQM,
          annualPaymentPence: RATE_PENCE_PER_SQM * quantity
        })
      ])
    )
  })

  it('application/validate accepts sqm unit and runs hefer-consent-required rule', async () => {
    const response = await apiClient.post('/api/v2/application/validate', {
      applicationId: 'test-application-hef1',
      requester: 'test-requester',
      applicantCrn: '1234567890',
      sbi: '123456789',
      landActions: [{ ...PARCEL, actions: [{ code: CODE, quantity: 150 }] }]
    })

    expect(response.status).toBe(200)
    expect(response.body.actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          actionCode: CODE,
          version: VERSION,
          hasPassed: true,
          sheetId: PARCEL.sheetId,
          parcelId: PARCEL.parcelId,
          rules: expect.arrayContaining([
            expect.objectContaining({
              name: 'hefer-consent-required',
              passed: true,
              description: expect.any(String)
            })
          ])
        })
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
          'https://www.gov.uk/find-funding-for-land-or-farms/hef1-maintain-weatherproof-traditional-farm-or-forestry-buildings'
      })
    )
  })
})
