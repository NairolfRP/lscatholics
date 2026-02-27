import { BasePolicy } from '@adonisjs/bouncer'
import type User from '#users/models/user'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class JobPostingPolicy extends BasePolicy {
  async viewDashboard(user: User): Promise<AuthorizerResponse> {
    return await user.hasPermission('viewJobs')
  }

  async create(user: User): Promise<AuthorizerResponse> {
    return await user.hasPermission('createJobs')
  }

  async edit(user: User): Promise<AuthorizerResponse> {
    return await user.hasPermission('editJobs')
  }

  async delete(user: User): Promise<AuthorizerResponse> {
    return await user.hasPermission('deleteJobs')
  }
}
