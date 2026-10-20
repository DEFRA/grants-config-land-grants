import { linearActionSchema } from '../../schemas/index.js'

export default linearActionSchema('BND2', [
  'available-length',
  'minimum-length',
  'hefer-consent-required',
  'sssi-consent-required'
])
