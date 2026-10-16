import Joi from 'joi'
import { paymentMethodSchema, paymentSchema } from './paymentMethods.js'
import { ruleSchema } from './rules.js'

const baseAction = {
  description: Joi.string().required(),
  display: Joi.boolean().required(),
  displayOrder: Joi.number().integer().min(0).required(),
  durationYears: Joi.number().integer().min(1).required(),
  enabled: Joi.boolean().required(),
  groupId: Joi.number().integer().allow(null).required(),
  applicationUnitOfMeasurement: Joi.string()
    .valid('ha', 'm', 'sqm', 'count')
    .required(),
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

export const actionSchema = (code, ruleNames) =>
  Joi.object({
    ...baseAction,
    code: Joi.string().valid(code).required(),
    rules: Joi.array().items(ruleSchema(ruleNames)).unique('name').required()
  })
