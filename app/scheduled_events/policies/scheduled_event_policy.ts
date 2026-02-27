import { BasePolicy } from '@adonisjs/bouncer'
import type User from '#users/models/user'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class ScheduledEventPolicy extends BasePolicy {
  async viewDashboard(user: User): Promise<AuthorizerResponse> {
    return await user.hasPermission('manageEvents')
  }

  async create(user: User): Promise<AuthorizerResponse> {
    return await user.hasPermission('manageEvents')
  }

  async edit(user: User): Promise<AuthorizerResponse> {
    return await user.hasPermission('manageEvents')
  }

  async delete(user: User): Promise<AuthorizerResponse> {
    return await user.hasPermission('manageEvents')
  }
}
