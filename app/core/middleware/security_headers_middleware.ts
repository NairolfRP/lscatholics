import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class SecurityHeadersMiddleware {
  async handle({ response }: HttpContext, next: NextFn) {
    response.header('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.header(
      'Permissions-Policy',
      ['camera=()', 'microphone=()', 'geolocation=()', 'payment=()', 'usb=()'].join(', ')
    )

    return await next()
  }
}
