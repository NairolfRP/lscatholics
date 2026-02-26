import type User from '#models/user'
import { BaseTransformer } from '@adonisjs/core/transformers'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

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
}
