export function failAction(request, _h, error) {
  request.logger.warn(error, error?.message)
  throw error
}
