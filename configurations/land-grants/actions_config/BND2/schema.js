import { actionSchema } from '../../schemas/index.js'

export default actionSchema('BND2', [
  'available-length',
  'minimum-length',
  'hefer-consent-required',
  'sssi-consent-required'
])
