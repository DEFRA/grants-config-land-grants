import { describe, beforeAll, it, expect } from 'vitest'
import { publishConfig } from '../../setup/publish-config.js'
import { apiClient } from '../../setup/api-client.js'

const CODE = 'BND1_26'
const VERSION = '1.2.0'
const RATE_PENCE_PER_METRE = 27
const MINIMUM_LENGTH_M = 20
const PAYMENT_QUANTITY_M = 100

const CLEAN_PARCEL = { sheetId: 'SD6743', parcelId: '8083' }
const CLEAN_PARCEL_PERIMETER_M = 927

const validate = (quantity) =>
  apiClient.post('/api/v2/application/validate', {
    applicationId: 'test-application-bnd1_26-1.2.0',
    requester: 'test-requester',
    applicantCrn: '1234567890',
    sbi: '123456789',
    landActions: [
      {
        ...CLEAN_PARCEL,
        actions: [{ code: CODE, quantity, version: VERSION }]
      }
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

  it('parcels offers the action', async () => {
    const response = await apiClient.post('/api/v2/parcels', {
      sbi: '123456789',
      parcelIds: [`${CLEAN_PARCEL.sheetId}-${CLEAN_PARCEL.parcelId}`],
      fields: ['actions']
    })

    expect(response.status).toBe(200)
    const codes = response.body.parcels[0].actions.map((action) => action.code)
    expect(codes).toContain(CODE)
  })

  it('payments/calculate pays the configured rate per metre', async () => {
    const response = await apiClient.post('/api/v2/payments/calculate', {
      startDate: '2026-10-18',
      parcel: [
        {
          ...CLEAN_PARCEL,
          actions: [
            { code: CODE, quantity: PAYMENT_QUANTITY_M, version: VERSION }
          ]
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
    const response = await validate(MINIMUM_LENGTH_M - 1)

    expect(response.status).toBe(200)
    expect(ruleNamed(response, 'minimum-length')).toEqual(
      expect.objectContaining({
        passed: false,
        reason: `The length must be at least ${MINIMUM_LENGTH_M} m`
      })
    )
  })

  it('application/validate fails a length above the available length', async () => {
    const response = await validate(CLEAN_PARCEL_PERIMETER_M + 1)

    expect(response.status).toBe(200)
    expect(
      ruleNamed(response, 'applied-for-total-or-partial-available-length')
    ).toEqual(
      expect.objectContaining({
        passed: false,
        reason: `Enter a value that is no more than the available length for this land parcel ${CLEAN_PARCEL_PERIMETER_M} m`
      })
    )
  })

  it('application/validate passes a length below the available length', async () => {
    const response = await validate(PAYMENT_QUANTITY_M)

    expect(response.status).toBe(200)
    expect(
      ruleNamed(response, 'applied-for-total-or-partial-available-length')
    ).toEqual(expect.objectContaining({ passed: true }))
  })
})
