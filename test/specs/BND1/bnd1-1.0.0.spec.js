import { describe, beforeAll, it, expect } from 'vitest'
import { publishConfig } from '../../setup/publish-config.js'
import { apiClient } from '../../setup/api-client.js'

// Requires land-grants-api commits 9215f75e (boundary-intersection-consent-required
// rule) and 25c7b806 (the same rule on /parcels)

const CODE = 'BND1'
const VERSION = '1.0.0'
const RATE_PENCE_PER_METRE = 27
const PAYMENT_QUANTITY_M = 100

// Perimeters and intersections are integer metres from the seeded image
const CLEAN_PARCEL = { sheetId: 'SD6743', parcelId: '8083' }
const SSSI_BOUNDARY_PARCEL = { sheetId: 'SD6855', parcelId: '7704' }

describe(`${CODE} @ ${VERSION}`, () => {
  beforeAll(async () => {
    await publishConfig({ code: CODE, semanticVersion: VERSION })
  })

  it('payments/calculate pays the configured rate per metre', async () => {
    const response = await apiClient.post('/api/v2/payments/calculate', {
      startDate: '2026-10-18',
      parcel: [
        {
          ...CLEAN_PARCEL,
          actions: [{ code: CODE, quantity: PAYMENT_QUANTITY_M }]
        }
      ]
    })

    expect(response.status).toBe(200)
    expect(Object.values(response.body.payment.parcelItems)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: CODE,
          version: VERSION,
          annualPaymentPence: PAYMENT_QUANTITY_M * RATE_PENCE_PER_METRE
        })
      ])
    )
  })
  // The action is enabled but not displayed, so it validates and prices while
  // no applicant can select it. When display is turned on, this assertion
  // inverts: the action appears with sssiConsentRequired true on this parcel.
  it('parcels does not offer the action while it is not displayed', async () => {
    const response = await apiClient.post('/api/v2/parcels', {
      sbi: '123456789',
      parcelIds: [
        `${SSSI_BOUNDARY_PARCEL.sheetId}-${SSSI_BOUNDARY_PARCEL.parcelId}`
      ],
      fields: ['actions', 'actions.sssiConsentRequired']
    })

    expect(response.status).toBe(200)
    const codes = response.body.parcels[0].actions.map((action) => action.code)
    expect(codes).not.toContain(CODE)
  })
})
