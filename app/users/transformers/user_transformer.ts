import type User from '#users/models/user'
import { BaseTransformer } from '@adonisjs/core/transformers'
import { inject } from '@adonisjs/core'
// oxlint-disable-next-line typescript/consistent-type-imports
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

  async withRoles() {
    return {
      ...this.toObject(),
      roles: RoleTransformer.transform(this.resource.roles).useVariant('minimalDetails'),
    }
  }
}
