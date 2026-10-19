import { linearActionSchema } from '../../schemas/index.js'

export default linearActionSchema('WBD1', [
  'hefer-consent-required',
  'pond-check-required',
  'parcel-has-valid-land-cover'
])
