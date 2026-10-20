import { linearActionSchema } from '../../schemas/index.js'

export default linearActionSchema('BND1', [
  'minimum-length',
  'sssi-consent-required',
  'hefer-consent-required'
])
