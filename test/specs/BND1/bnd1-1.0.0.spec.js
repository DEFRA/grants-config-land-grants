import { describe, beforeAll, it, expect } from 'vitest'
import { publishConfig } from '../../setup/publish-config.js'
import { apiClient } from '../../setup/api-client.js'

// Requires land-grants-api commits 9215f75e (boundary-intersection-consent-required
// rule) and 25c7b806 (the same rule on /parcels)

const CODE = 'BND1'
const VERSION = '1.0.0'
const RATE_PENCE_PER_METRE = 27
const MINIMUM_LENGTH_M = 20
const PAYMENT_QUANTITY_M = 100

// Perimeters and intersections are integer metres from the seeded image
const CLEAN_PARCEL = { sheetId: 'SD6743', parcelId: '8083' }
const CLEAN_PARCEL_PERIMETER_M = 927
const SSSI_BOUNDARY_PARCEL = { sheetId: 'SD6855', parcelId: '7704' }
const SSSI_BOUNDARY_M = 897
const HISTORIC_BOUNDARY_PARCEL = { sheetId: 'NZ5500', parcelId: '0465' }
const HISTORIC_BOUNDARY_M = 929

const validate = (parcel, quantity) =>
  apiClient.post('/api/v2/application/validate', {
    applicationId: 'test-application-1',
    requester: 'test-requester',
    applicantCrn: '1234567890',
    sbi: '123456789',
    landActions: [{ ...parcel, actions: [{ code: CODE, quantity }] }]
  })

const rulesFor = (response) =>
  response.body.actions.find((a) => a.actionCode === CODE).rules

const ruleNamed = (response, name) =>
  rulesFor(response).find((r) => r.name === name)

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

  it('application/validate fails a length below the minimum', async () => {
    const response = await validate(CLEAN_PARCEL, MINIMUM_LENGTH_M - 1)

    expect(response.status).toBe(200)
    expect(ruleNamed(response, 'minimum-length')).toEqual(
      expect.objectContaining({
        passed: false,
        reason: `Enter a value that is no less than the minimum length for this action ${MINIMUM_LENGTH_M} m`
      })
    )
  })

  it('application/validate fails a length above the available length', async () => {
    const response = await validate(CLEAN_PARCEL, CLEAN_PARCEL_PERIMETER_M + 1)

    expect(response.status).toBe(200)
    expect(ruleNamed(response, 'minimum-length')).toEqual(
      expect.objectContaining({
        passed: false,
        reason: `Enter a value that is no more than the available length for this land parcel ${CLEAN_PARCEL_PERIMETER_M} m`
      })
    )
  })

  it('application/validate passes the minimum length with no caveats on a clean parcel', async () => {
    const response = await validate(CLEAN_PARCEL, MINIMUM_LENGTH_M)

    expect(response.status).toBe(200)
    const rules = rulesFor(response)
    expect(rules.map((r) => r.name).sort()).toEqual([
      'hefer-consent-required',
      'minimum-length',
      'sssi-consent-required'
    ])
    expect(rules.every((r) => r.passed)).toBe(true)
    expect(rules.some((r) => r.caveat)).toBe(false)
    expect(ruleNamed(response, 'minimum-length').explanations).toEqual([
      {
        title: 'Minimum length',
        lines: expect.arrayContaining([
          `The parcel boundary is (${CLEAN_PARCEL_PERIMETER_M} m) and (0 m) is already committed to incompatible actions`
        ])
      }
    ])
  })

  it('application/validate raises the SSSI consent caveat from the boundary, not the area', async () => {
    const response = await validate(SSSI_BOUNDARY_PARCEL, MINIMUM_LENGTH_M)

    expect(response.status).toBe(200)
    expect(ruleNamed(response, 'sssi-consent-required')).toEqual(
      expect.objectContaining({
        passed: true,
        caveat: expect.objectContaining({
          code: 'ne-consent-required',
          description: 'A consent is required from Natural England',
          metadata: expect.objectContaining({
            intersectingLengthMeters: SSSI_BOUNDARY_M
          })
        })
      })
    )
    expect(ruleNamed(response, 'hefer-consent-required')).toEqual(
      expect.objectContaining({ passed: true })
    )
    expect(ruleNamed(response, 'hefer-consent-required').caveat).toBeUndefined()
  })

  it('application/validate raises the HEFER caveat from the boundary', async () => {
    const response = await validate(HISTORIC_BOUNDARY_PARCEL, MINIMUM_LENGTH_M)

    expect(response.status).toBe(200)
    expect(ruleNamed(response, 'hefer-consent-required')).toEqual(
      expect.objectContaining({
        passed: true,
        caveat: expect.objectContaining({
          code: 'hefer-consent-required',
          description: 'A HEFER is needed from Historic England',
          metadata: expect.objectContaining({
            intersectingLengthMeters: HISTORIC_BOUNDARY_M
          })
        })
      })
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
    expect(response.body.parcels[0].actions).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ code: CODE })])
    )
  })
})
