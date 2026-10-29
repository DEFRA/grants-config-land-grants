import { describe, beforeAll, it, expect } from 'vitest'
import { publishConfig } from '../../setup/publish-config.js'
import { apiClient } from '../../setup/api-client.js'

const CODE = 'BND2_26'
const VERSION = '1.1.0'
const RATE_PENCE_M = 11
const MINIMUM_LENGTH_M = 20

// Perimeters and intersections are integer metres from the seeded image
const PARCEL = { sheetId: 'SD6743', parcelId: '8083' }
const PARCEL_PERIMETER_M = 927
const SSSI_BOUNDARY_PARCEL = { sheetId: 'SD6855', parcelId: '7704' }
const SSSI_BOUNDARY_M = 897
const HISTORIC_BOUNDARY_PARCEL = { sheetId: 'NZ5500', parcelId: '0465' }
const HISTORIC_BOUNDARY_M = 929

const validate = (parcel, quantity) =>
  apiClient.post('/api/v2/application/validate', {
    applicationId: 'test-application-bnd2_26-1.1.0',
    requester: 'test-requester',
    applicantCrn: '9000000099',
    sbi: '800000999',
    landActions: [
      { ...parcel, actions: [{ code: CODE, quantity, version: VERSION }] }
    ]
  })

const ruleNamed = (response, name) =>
  response.body.actions
    .find((a) => a.actionCode === CODE)
    .rules.find((r) => r.name === name)

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
          annualPaymentPence: RATE_PENCE_M
        })
      ])
    )
  })

  it('application/validate accepts the config', async () => {
    const response = await validate(PARCEL, 1)

    expect(response.status).toBe(200)
    expect(response.body.actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ actionCode: CODE, version: VERSION })
      ])
    )
  })

  it('application/validate fails a length below the minimum', async () => {
    const response = await validate(PARCEL, MINIMUM_LENGTH_M - 1)

    expect(response.status).toBe(200)
    expect(ruleNamed(response, 'minimum-length')).toEqual(
      expect.objectContaining({
        passed: false,
        reason: `The length must be at least ${MINIMUM_LENGTH_M} m`
      })
    )
  })

  it('application/validate fails a length above the available length', async () => {
    const response = await validate(PARCEL, PARCEL_PERIMETER_M + 1)

    expect(response.status).toBe(200)
    expect(
      ruleNamed(response, 'applied-for-total-or-partial-available-length')
    ).toEqual(
      expect.objectContaining({
        passed: false,
        reason: `Enter a value that is no more than the available length for this land parcel ${PARCEL_PERIMETER_M} m`
      })
    )
  })

  it('application/validate passes the boundary consent rules with no caveat on a clear boundary', async () => {
    const response = await validate(PARCEL, MINIMUM_LENGTH_M)

    expect(response.status).toBe(200)
    expect(
      ['sssi-consent-required', 'hefer-consent-required'].map((name) => {
        const { passed, caveat } = ruleNamed(response, name)
        return { name, passed, caveat }
      })
    ).toEqual([
      { name: 'sssi-consent-required', passed: true, caveat: undefined },
      { name: 'hefer-consent-required', passed: true, caveat: undefined }
    ])
  })

  it('application/validate raises the SSSI consent caveat from the boundary', async () => {
    const response = await validate(SSSI_BOUNDARY_PARCEL, MINIMUM_LENGTH_M)

    expect(response.status).toBe(200)
    expect(ruleNamed(response, 'sssi-consent-required').caveat).toEqual(
      expect.objectContaining({
        code: 'ne-consent-required',
        metadata: expect.objectContaining({
          overlapLengthMeters: SSSI_BOUNDARY_M
        })
      })
    )
  })

  it('application/validate raises the HEFER caveat from the boundary', async () => {
    const response = await validate(HISTORIC_BOUNDARY_PARCEL, MINIMUM_LENGTH_M)

    expect(response.status).toBe(200)
    expect(ruleNamed(response, 'hefer-consent-required').caveat).toEqual(
      expect.objectContaining({
        code: 'hefer-consent-required',
        metadata: expect.objectContaining({
          overlapLengthMeters: HISTORIC_BOUNDARY_M
        })
      })
    )
  })
})
