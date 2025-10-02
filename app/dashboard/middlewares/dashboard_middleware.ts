import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class DashboardMiddleware {
  async handle({ bouncer, inertia, response }: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    if (!(await bouncer.allows('userAbility', 'dashboardAccess'))) {
      return response.redirect().toRoute('home')
    }

    inertia.share({
      permissions: async (ctx: HttpContext) =>
        ((await ctx.auth.user!.getPermissions()) || []) as string[],
    })

    return await next()
  }
}
