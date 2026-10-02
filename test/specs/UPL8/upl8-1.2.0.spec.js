import { describe, beforeAll, it, expect } from 'vitest'
import { publishConfig } from '../../setup/publish-config.js'
import { apiClient } from '../../setup/api-client.js'

const CODE = 'UPL8'
const VERSION = '1.2.0'
const REPLACEMENT_CODE = 'UPL8_26'
const REPLACEMENT_VERSION = '1.0.0'
const RATE_PENCE_PER_HA = 7400
const QUANTITY = 2
const PARCEL = { sheetId: 'SD5649', parcelId: '9215' }

describe(`${CODE} @ ${VERSION}`, () => {
  beforeAll(async () => {
    await publishConfig({ code: CODE, semanticVersion: VERSION })
    await publishConfig({
      code: REPLACEMENT_CODE,
      semanticVersion: REPLACEMENT_VERSION
    })
  })

  it('parcels offers the _26 replacement instead of the legacy action', async () => {
    const response = await apiClient.post('/api/v2/parcels', {
      sbi: '123456789',
      parcelIds: [`${PARCEL.sheetId}-${PARCEL.parcelId}`],
      fields: ['actions']
    })

    expect(response.status).toBe(200)
    const codes = response.body.parcels[0].actions.map((action) => action.code)
    expect(codes).not.toContain(CODE)
    expect(codes).toContain(REPLACEMENT_CODE)
  })

  it('payments/calculate still pays the configured rate', async () => {
    const response = await apiClient.post('/api/v2/payments/calculate', {
      startDate: '2025-09-15',
      parcel: [
        {
          ...PARCEL,
          actions: [{ code: CODE, quantity: QUANTITY, version: VERSION }]
        }
      ]
    })

    expect(response.status).toBe(200)
    expect(Object.values(response.body.payment.parcelItems)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: CODE,
          version: VERSION,
          unit: 'ha',
          quantity: QUANTITY,
          rateInPence: RATE_PENCE_PER_HA,
          annualPaymentPence: RATE_PENCE_PER_HA * QUANTITY
        })
      ])
    )
  })

  it('application/validate still accepts the config', async () => {
    const response = await apiClient.post('/api/v2/application/validate', {
      applicationId: 'test-application-upl8-1.2.0',
      requester: 'test-requester',
      applicantCrn: '1234567890',
      sbi: '123456789',
      landActions: [
        { ...PARCEL, actions: [{ code: CODE, quantity: 1, version: VERSION }] }
      ]
    })

    expect(response.status).toBe(200)
    expect(response.body.actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ actionCode: CODE, version: VERSION })
      ])
    )
  })
})
