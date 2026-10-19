import Joi from 'joi'
import { paymentMethodSchema, paymentSchema } from './paymentMethods.js'
import { ruleSchema } from './rules.js'

const baseAction = {
  applicationUnitOfMeasurement: Joi.string().required(),
  description: Joi.string().required(),
  display: Joi.boolean().required(),
  displayOrder: Joi.number().integer().min(0).required(),
  durationYears: Joi.number().integer().min(1).required(),
  enabled: Joi.boolean().required(),
  groupId: Joi.number().integer().allow(null).required(),
  startDate: Joi.date().iso().required(),
  semanticVersion: Joi.string()
    .pattern(/^\d+\.\d+\.\d+$/)
    .required(),
  guidanceUrl: Joi.string().uri({ scheme: 'https' }),
  availability: Joi.object({
    type: Joi.string().valid('total', 'partial').required()
  }),
  displayUnit: Joi.string(),
  displayUnitPlural: Joi.string(),
  rotationType: Joi.string().valid('rotational'),
  payment: paymentSchema,
  paymentMethod: paymentMethodSchema.required()
}

const areaAction = {
  ...baseAction,
  applicationUnitOfMeasurement: Joi.string()
    .valid('ha', 'sqm', 'count')
    .required()
}

const linearAction = {
  ...baseAction,
  applicationUnitOfMeasurement: Joi.string().valid('m', 'count').required()
}

export const areaActionSchema = (code, ruleNames) =>
  Joi.object({
    ...areaAction,
    code: Joi.string().valid(code).required(),
    rules: Joi.array().items(ruleSchema(ruleNames)).unique('name').required()
  })

export const linearActionSchema = (code, ruleNames) =>
  Joi.object({
    ...linearAction,
    code: Joi.string().valid(code).required(),
    rules: Joi.array().items(ruleSchema(ruleNames)).unique('name').required()
  })
