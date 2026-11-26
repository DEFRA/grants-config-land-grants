import { describe, beforeAll, it, expect } from 'vitest'
import { publishConfig } from '../../setup/publish-config.js'
import { apiClient } from '../../setup/api-client.js'

const CODE = 'GRH8_26'
const VERSION = '1.2.0'
const RATE_PENCE_PER_HA = 18700
const PARCEL = { sheetId: 'SD6743', parcelId: '8083' }
// Wholly inside SSSI, historic_features and moorland in the seeded image
const PROTECTED_MOORLAND_PARCEL = { sheetId: 'ST1437', parcelId: '7349' }

describe(`${CODE} @ ${VERSION}`, () => {
  beforeAll(async () => {
    await publishConfig({ code: CODE, semanticVersion: VERSION })
  })

  it('payments/calculate returns the configured rate', async () => {
    const response = await apiClient.post('/api/v2/payments/calculate', {
      startDate: '2026-10-18',
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
      applicationId: 'test-application-grh8_26-1.2.0',
      requester: 'test-requester',
      applicantCrn: '9000000099',
      sbi: '800000999',
      landActions: [{ ...PARCEL, actions: [{ code: CODE, quantity: 1 }] }]
    })

    expect(response.status).toBe(200)
    expect(response.body.actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ actionCode: CODE, version: VERSION })
      ])
    )
  })

  it('application/validate leaves SSSI, historic_features and moorland eligibility to the base action', async () => {
    const response = await apiClient.post('/api/v2/application/validate', {
      applicationId: 'test-application-grh8_26-1.2.0-protected-moorland',
      requester: 'test-requester',
      applicantCrn: '9000000099',
      sbi: '800000999',
      landActions: [
        { ...PROTECTED_MOORLAND_PARCEL, actions: [{ code: CODE, quantity: 1 }] }
      ]
    })
    const supplement = response.body.actions.find(
      (action) => action.actionCode === CODE
    )
    const rulesRun = supplement.rules.map((rule) => rule.name)

    expect(rulesRun).toEqual(['applied-for-total-or-partial-available-area'])
  })
})
