import Joi from 'joi'

const layerName = (...names) =>
  Joi.string()
    .valid(...names)
    .required()

const areaConsentRequired = (layer) =>
  Joi.object({
    layerName: layerName(layer),
    caveatDescription: Joi.string().required(),
    caveatCode: Joi.string(),
    tolerancePercent: Joi.number().required()
  })

const boundaryConsentRequired = Joi.object({
  layerName: layerName('sssi', 'historic_features'),
  caveatCode: Joi.string().required(),
  caveatDescription: Joi.string().required(),
  toleranceMeters: Joi.number()
})

export const ruleConfigs = {
  'applied-for-total-available-area': null,
  'applied-for-total-or-partial-available-area': null,
  'applied-for-total-or-partial-available-length': null,
  'available-length': null,
  'parcel-has-valid-land-cover': null,
  'total-area-not-exceed-land-parcels-woodland-management-plan': null,
  'sssi-consent-required': areaConsentRequired('sssi'),
  'hefer-consent-required': areaConsentRequired('historic_features'),
  'boundary-intersection-consent-required': boundaryConsentRequired,
  'manual-check-required': Joi.object({
    caveatDescription: Joi.string().required()
  }),
  'minimum-length': Joi.object({ minimumLengthM: Joi.number().required() }),
  'min-max-parcel-size': Joi.object({
    minimumParcelSizeSqm: Joi.number().required(),
    maximumParcelSizeSqm: Joi.number()
  }),
  'parcel-has-intersection-with-data-layer': Joi.object({
    layerName: layerName('moorland', 'lfa'),
    tolerancePercent: Joi.number().required(),
    minimumIntersectionPercent: Joi.number().required()
  }),
  'parcel-intersection-does-not-exceed-maximum-for-data-layer': Joi.object({
    layerName: layerName('moorland'),
    tolerancePercent: Joi.number().required(),
    maximumIntersectionPercent: Joi.number().required()
  }),
  'parcel-has-minimum-eligibility-for-woodland-management-plan': Joi.object({
    minimumSize: Joi.number().required(),
    minOldWoodlandHa: Joi.number().required()
  })
}

const ruleKeys = Object.keys(ruleConfigs)

const configFor = (ruleKey) =>
  ruleConfigs[ruleKey] ? ruleConfigs[ruleKey].required() : Joi.forbidden()

const ruleConfig = (allowedNames) =>
  Joi.when('type', {
    switch: ruleKeys.map((type) => ({ is: type, then: configFor(type) })),
    // Without a type the name is the rule key; names that only run through a type are skipped
    otherwise: Joi.when('name', {
      switch: allowedNames
        .filter((name) => name in ruleConfigs)
        .map((name) => ({ is: name, then: configFor(name) }))
    })
  })

const ruleType = (requiredTypes) =>
  Joi.string()
    .valid(...ruleKeys)
    // A name that is not itself a rule key only runs through a type
    .when('name', { not: Joi.valid(...ruleKeys), then: Joi.required() })
    .when('name', {
      switch: Object.entries(requiredTypes).map(([name, type]) => ({
        is: name,
        then: Joi.valid(Joi.override, type).required()
      }))
    })

export const ruleSchema = (allowedNames, requiredTypes = {}) =>
  Joi.object({
    description: Joi.string().required(),
    name: Joi.string()
      .valid(...allowedNames)
      .required(),
    type: ruleType(requiredTypes),
    version: Joi.string(),
    config: ruleConfig(allowedNames)
  })
