import { BasePolicy } from '@adonisjs/bouncer'
import type User from '#users/models/user'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class PostPolicy extends BasePolicy {
  async viewDashboard(user: User): Promise<AuthorizerResponse> {
    return await user.hasPermission('viewArticles')
  }

  async create(user: User): Promise<AuthorizerResponse> {
    return await user.hasPermission('createArticles')
  }

  async edit(user: User): Promise<AuthorizerResponse> {
    return await user.hasPermission('editArticles')
  }

  async delete(user: User): Promise<AuthorizerResponse> {
    return await user.hasPermission('deleteArticles')
  }
}
