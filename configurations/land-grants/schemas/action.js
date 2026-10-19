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

const unitOfMeasurement = (...units) =>
  Joi.string()
    .valid(...units)
    .required()

const actionCode = (code) => Joi.string().valid(code).required()

const actionRules = (allowedNames) =>
  Joi.array().items(ruleSchema(allowedNames)).unique('name').required()

const actionSchema = ({ units, code, allowedNames }) =>
  Joi.object({
    ...baseAction,
    applicationUnitOfMeasurement: unitOfMeasurement(...units),
    code: actionCode(code),
    rules: actionRules(allowedNames)
  })

export const areaActionSchema = (code, allowedNames) =>
  actionSchema({ units: ['ha', 'sqm'], code, allowedNames })

export const linearActionSchema = (code, allowedNames) =>
  actionSchema({ units: ['m'], code, allowedNames })

export const countActionSchema = (code, allowedNames) =>
  actionSchema({ units: ['count'], code, allowedNames })
