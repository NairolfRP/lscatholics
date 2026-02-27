import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class IntendedUrlMiddleware {
  async handle({ auth, session, request }: HttpContext, next: NextFn) {
    const isNotAuthenticated = !auth.isAuthenticated
    const isGetRequest = request.method() === 'GET'
    const isNotAuthApiRoute = !request.url().includes('/api/auth')

    if (isNotAuthenticated && isGetRequest && isNotAuthApiRoute) {
      session.put('url.intended', request.url(true))
    }

    return next()
  }
}
