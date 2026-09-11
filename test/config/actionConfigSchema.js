import Joi from 'joi'

const ruleConfigSchema = Joi.object({
  layerName: Joi.string(),
  minimumIntersectionPercent: Joi.number(),
  maximumIntersectionPercent: Joi.number(),
  tolerancePercent: Joi.number(),
  caveatDescription: Joi.string(),
  minimumSize: Joi.number(),
  minOldWoodlandHa: Joi.number(),
  minimumParcelSizeSqm: Joi.number(),
  maximumParcelSizeSqm: Joi.number(),
  minimumLengthM: Joi.number()
}).unknown(true)

const ruleSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  type: Joi.string(),
  version: Joi.string(),
  config: ruleConfigSchema
})

const paymentSchema = Joi.object({
  ratePerUnitGbp: Joi.number(),
  ratePerAgreementPerYearGbp: Joi.number()
})

const paymentTierSchema = Joi.object({
  flatRateGbp: Joi.number(),
  lowerLimitHa: Joi.number(),
  upperLimitHa: Joi.number().allow(null),
  ratePerUnitGbp: Joi.number()
})

const paymentMethodConfigSchema = Joi.object({
  ratePerUnitGbp: Joi.number(),
  ratePerAgreementPerYearGbp: Joi.number(),
  tiers: Joi.array().items(paymentTierSchema),
  newWoodlandMaxPercent: Joi.number()
}).unknown(true)

const paymentMethodSchema = Joi.object({
  name: Joi.string().required(),
  version: Joi.string(),
  config: paymentMethodConfigSchema
})

const availabilitySchema = Joi.object({
  type: Joi.string().valid('total', 'partial').required()
})

export const actionConfigSchema = Joi.object({
  code: Joi.string().required(),
  description: Joi.string().required(),
  display: Joi.boolean().required(),
  displayOrder: Joi.number().required(),
  durationYears: Joi.number().required(),
  enabled: Joi.boolean().required(),
  groupId: Joi.number().allow(null).required(),
  applicationUnitOfMeasurement: Joi.string().required(),
  startDate: Joi.string().required(),
  semanticVersion: Joi.string().required(),
  guidanceUrl: Joi.string(),
  availability: availabilitySchema,
  payment: paymentSchema.allow(null).required(),
  paymentMethod: paymentMethodSchema.required(),
  rules: Joi.array().items(ruleSchema).required()
})
