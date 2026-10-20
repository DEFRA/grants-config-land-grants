import Joi from 'joi'

const rate = Joi.number().min(0)

const tier = Joi.object({
  flatRateGbp: rate.required(),
  lowerLimitHa: rate.required(),
  upperLimitHa: rate.allow(null).required(),
  ratePerUnitGbp: rate.required()
})

const defaultCalculation = Joi.object({
  name: 'default-calculation',
  version: Joi.string(),
  config: Joi.object({
    ratePerUnitGbp: rate.required(),
    ratePerAgreementPerYearGbp: rate
  }).required()
})

const wmpCalculation = Joi.object({
  name: 'wmp-calculation',
  version: Joi.string(),
  config: Joi.object({
    tiers: Joi.array().items(tier).min(1).required(),
    newWoodlandMaxPercent: Joi.number().required()
  }).required()
})

export const paymentMethodSchema = Joi.alternatives().conditional('.name', {
  switch: [
    { is: 'default-calculation', then: defaultCalculation },
    { is: 'wmp-calculation', then: wmpCalculation }
  ],
  otherwise: Joi.forbidden()
})

export const paymentSchema = Joi.when('paymentMethod.name', {
  is: 'default-calculation',
  then: Joi.object({
    ratePerUnitGbp: Joi.valid(Joi.ref('/paymentMethod.config.ratePerUnitGbp')),
    ratePerAgreementPerYearGbp: Joi.valid(
      Joi.ref('/paymentMethod.config.ratePerAgreementPerYearGbp')
    )
  }).required(),
  otherwise: Joi.valid(null).required()
})
