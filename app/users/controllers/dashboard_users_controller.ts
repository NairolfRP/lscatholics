import type { HttpContext } from '@adonisjs/core/http'
import User from '#users/models/user'
import UserTransformer from '#users/transformers/user_transformer'
import RoleTransformer from '#roles/transformers/role_transformer'
import Role from '#roles/models/role'
import { updateDashboardUserValidator } from '#users/validators/dashboard_users'

export default class DashboardUsersController {
  async index({ bouncer, request, inertia }: HttpContext) {
    await bouncer.with('UserPolicy').authorize('viewDashboard')

    const search = request.input('search', '')
    let page = request.input('page', 1)
    const limit = request.input('limit', 10)

    if (page <= 0) {
      page = 1
    }

    let query = User.query().select('id', 'name', 'createdAt').preloadOnce('roles')

    if (search) {
      query = query.where((builder) => {
        builder.whereRaw('LOWER(name) LIKE ?', [`%${search.toLowerCase()}%`])
      })
    }

    const users = await query.orderBy('createdAt', 'desc').paginate(page, limit)

    return inertia.render('dashboard/users/index', {
      users: UserTransformer.paginate(users.all(), users.getMeta()).useVariant('withRoles'),
      filters: { search },
    })
  }

  async show({ bouncer, response }: HttpContext) {
    await bouncer.with('UserPolicy').authorize('viewDashboard')
    return response.redirect().toRoute('dashboard.dashboard_users.index')
  }

  async edit({ bouncer, params, auth, inertia }: HttpContext) {
    await bouncer.with('UserPolicy').authorize('edit')

    const user = await User.findOrFail(params.id)

    await user.loadOnce('roles')

    const rolesList = await Role.query().select('id', 'slug', 'name', 'hierarchyOrder')

    await auth.user!.load('roles')

    const editorHighestRole = auth.user!.getHighestRole()

    return inertia.render('dashboard/users/edit', {
      itemUser: UserTransformer.transform(user).useVariant('withRoles'),
      rolesList: RoleTransformer.transform(rolesList).useVariant('minimalDetails'),
      editorHighestRole: editorHighestRole
        ? RoleTransformer.transform(editorHighestRole).useVariant('minimalDetails')
        : null,
    })
  }

  async update({ bouncer, params, request, auth, response }: HttpContext) {
    await bouncer.with('UserPolicy').authorize('edit')

    const target = await User.findOrFail(params.id)
    const payload = await request.validateUsing(updateDashboardUserValidator, {
      meta: {
        currentUser: auth.user!,
        target,
      },
    })

    await target.related('roles').sync(payload.roles)

    return response.redirect().toRoute('dashboard.dashboard_users.index')
  }

  async destroy({ bouncer, params, session, response }: HttpContext) {
    await bouncer.with('UserPolicy').authorize('delete', params.id)

    const user = await User.findOrFail(params.id)

    await user.delete()

    session.flash('success', `L'utilisateur '${user.name}' a été supprimé.`)

    return response.redirect().toRoute('dashboard.dashboard_users.index')
  }
}
