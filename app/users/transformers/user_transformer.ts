import type User from '#users/models/user'
import { BaseTransformer } from '@adonisjs/core/transformers'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import RoleTransformer from '#roles/transformers/role_transformer'

export default class UserTransformer extends BaseTransformer<User> {
  toObject() {
    return this.pick(this.resource, ['id', 'name', 'createdAt'])
  }

  @inject()
  async userWithCurrentCharacter({ characters }: HttpContext) {
    const currentCharacter = await characters.getCurrentCharacter()

    return {
      ...this.toObject(),
      currentCharacter,
    }
  }

  @inject()
  async sharedProp(ctx: HttpContext) {
    const canAccessDashboard = await ctx.bouncer.with('DashboardPolicy').allows('access', ctx)
    return {
      ...(await this.userWithCurrentCharacter(ctx)),
      canAccessDashboard,
    }
  }

  async withRoles() {
    return {
      ...this.toObject(),
      roles: RoleTransformer.transform(this.resource.roles).useVariant('minimalDetails'),
    }
  }
}
