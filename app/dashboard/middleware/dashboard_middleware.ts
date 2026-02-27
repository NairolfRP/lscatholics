import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { dashboardAccessAbility } from '#users/abilities/main'

export default class DashboardMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const { bouncer, inertia, response, auth } = ctx
    if (auth.user) {
      await auth.user.load((loader) => {
        loader.load('roles', (rolesQuery) => {
          rolesQuery.preload('permissions')
        })
      })
    }

    if (await bouncer.denies(dashboardAccessAbility, ctx)) {
      return response.redirect().toRoute('home')
    }

    inertia.share({
      permissions: async () => ((await auth.user!.getPermissions()) || []) as string[],
    })

    return await next()
  }
}
