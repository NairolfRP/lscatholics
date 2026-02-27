import { BasePolicy } from '@adonisjs/bouncer'
import User from '#users/models/user'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class UserPolicy extends BasePolicy {
  async viewDashboard(user: User): Promise<AuthorizerResponse> {
    return await user.hasPermission('manageUsers')
  }

  async edit(user: User): Promise<AuthorizerResponse> {
    return await user.hasPermission('manageUsers')
  }

  async delete(user: User, targetId: number): Promise<AuthorizerResponse> {
    if (!(await user.hasPermission('deleteUsers')) || user.id === targetId) return false

    await user.load('roles')

    if (!user.roles || user.roles.length === 0) return false

    const target = await User.query().select('id').where('id', targetId).preload('roles').first()

    if (!target) return false

    if (!target.roles || target.roles.length === 0) return true

    const highestUserRole = user.roles.reduce(
      (min, role) => Math.min(min, role.hierarchyOrder),
      Infinity
    )

    const highestTargetRole = target.roles.reduce(
      (min, role) => Math.min(min, role.hierarchyOrder),
      Infinity
    )

    const hasTargetSuperiorRole = highestUserRole >= highestTargetRole

    return !hasTargetSuperiorRole
  }
}
