import { countActionSchema } from '../../schemas/index.js'

export default countActionSchema('WBD1', [
  'hefer-consent-required',
  'pond-check-required',
  'parcel-has-valid-land-cover'
])
