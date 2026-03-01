import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class DashboardMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const { bouncer, inertia, response, auth } = ctx

    if (!auth.user) {
      return response.redirect().toRoute('home')
    }

    if (!auth.user.$preloaded.roles) {
      await auth.user.load((loader) => {
        loader.load('roles', (q) => q.preload('permissions'))
      })
    }

    const canAccessDashboard = await bouncer.with('DashboardPolicy').allows('access', ctx)

    if (!canAccessDashboard) {
      return response.redirect().toRoute('home')
    }

    const permissions = (await auth.user.getPermissions()) as string[]

    inertia.share({ permissions })

    return await next()
  }
}
