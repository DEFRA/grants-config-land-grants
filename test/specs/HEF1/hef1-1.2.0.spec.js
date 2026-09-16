import { describe, beforeAll, it, expect } from 'vitest'
import { publishConfig } from '../../setup/publish-config.js'
import { apiClient } from '../../setup/api-client.js'

const CODE = 'HEF1'
const VERSION = '1.2.0'
const PARCEL = { sheetId: 'SD5649', parcelId: '9215' }

describe(`${CODE} @ ${VERSION}`, () => {
  beforeAll(async () => {
    await publishConfig({ code: CODE, semanticVersion: VERSION })
  })

  it('application/validate passes applied-for-total-or-partial-available-area when applying for less than the available building area', async () => {
    const response = await apiClient.post('/api/v2/application/validate', {
      applicationId: 'test-application-hef1-1.2.0-pass',
      requester: 'test-requester',
      applicantCrn: '1234567890',
      sbi: '123456789',
      landActions: [{ ...PARCEL, actions: [{ code: CODE, quantity: 1 }] }]
    })

    expect(response.status).toBe(200)
    expect(response.body.actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          actionCode: CODE,
          version: VERSION,
          sheetId: PARCEL.sheetId,
          parcelId: PARCEL.parcelId,
          rules: expect.arrayContaining([
            expect.objectContaining({
              name: 'applied-for-total-or-partial-available-area',
              passed: true,
              description: expect.any(String)
            })
          ])
        })
      ])
    )
  })

  it('application/validate fails applied-for-total-or-partial-available-area when applying for more than the available building area', async () => {
    const response = await apiClient.post('/api/v2/application/validate', {
      applicationId: 'test-application-hef1-1.2.0-fail',
      requester: 'test-requester',
      applicantCrn: '1234567890',
      sbi: '123456789',
      landActions: [{ ...PARCEL, actions: [{ code: CODE, quantity: 1000000 }] }]
    })

    expect(response.status).toBe(200)
    expect(response.body.actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          actionCode: CODE,
          version: VERSION,
          hasPassed: false,
          sheetId: PARCEL.sheetId,
          parcelId: PARCEL.parcelId,
          rules: expect.arrayContaining([
            expect.objectContaining({
              name: 'applied-for-total-or-partial-available-area',
              passed: false,
              description: expect.any(String)
            })
          ])
        })
      ])
    )
  })
})
