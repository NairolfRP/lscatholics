import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class IntendedUrlMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const isNotAuthenticated = !ctx.auth.isAuthenticated
    const isGetRequest = ctx.request.method() === 'GET'
    const isNotAuthApiRoute = !ctx.request.url().includes('/api/auth')

    if (isNotAuthenticated && isGetRequest && isNotAuthApiRoute) {
      ctx.setIntendedUrl(ctx.request.url(true))
    }

    return next()
  }
}
