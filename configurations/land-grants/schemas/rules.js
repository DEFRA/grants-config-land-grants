import Joi from 'joi'

const layerName = (...names) =>
  Joi.string()
    .valid(...names)
    .required()
const tolerancePercent = Joi.number().required()
const caveatDescription = Joi.string().required()

const consentRequired = (layer) =>
  Joi.object({
    layerName: layerName(layer),
    caveatDescription,
    caveatCode: Joi.string(),
    tolerancePercent: Joi.number(),
    toleranceMeters: Joi.number()
  }).xor('tolerancePercent', 'toleranceMeters')

const caveatCheck = Joi.object({ caveatDescription })

export const ruleConfigs = {
  'applied-for-total-available-area': null,
  'applied-for-total-or-partial-available-area': null,
  'applied-for-total-or-partial-available-length': null,
  'available-length': null,
  'parcel-has-valid-land-cover': null,
  'total-area-not-exceed-land-parcels-woodland-management-plan': null,
  'building-check-required': caveatCheck,
  'pond-check-required': caveatCheck,
  'sssi-consent-required': consentRequired('sssi'),
  'hefer-consent-required': consentRequired('historic_features'),
  'minimum-length': Joi.object({ minimumLengthM: Joi.number().required() }),
  'min-max-parcel-size': Joi.object({
    minimumParcelSizeSqm: Joi.number().required(),
    maximumParcelSizeSqm: Joi.number()
  }),
  'parcel-has-intersection-with-data-layer': Joi.object({
    layerName: layerName('moorland', 'lfa'),
    tolerancePercent,
    minimumIntersectionPercent: Joi.number().required()
  }),
  'parcel-intersection-does-not-exceed-maximum-for-data-layer': Joi.object({
    layerName: layerName('moorland'),
    tolerancePercent,
    maximumIntersectionPercent: Joi.number().required()
  }),
  'parcel-has-minimum-eligibility-for-woodland-management-plan': Joi.object({
    minimumSize: Joi.number().required(),
    minOldWoodlandHa: Joi.number().required()
  })
}

const configFor = (config) => (config ? config.required() : Joi.forbidden())

export const ruleSchema = (allowedNames) =>
  Joi.object({
    name: Joi.string()
      .valid(...allowedNames)
      .required(),
    description: Joi.string().required(),
    type: Joi.string(),
    version: Joi.string(),
    config: Joi.when('name', {
      switch: allowedNames.map((name) => ({
        is: name,
        then: configFor(ruleConfigs[name])
      }))
    })
  })
