import { actionSchema } from '../../schemas/index.js'

export default actionSchema('GRH12', [
  'min-max-parcel-size',
  'parcel-has-intersection-with-data-layer',
  'sssi-consent-required',
  'hefer-consent-required',
  'parcel-intersection-does-not-exceed-maximum-for-data-layer',
  'applied-for-total-or-partial-available-area'
])
