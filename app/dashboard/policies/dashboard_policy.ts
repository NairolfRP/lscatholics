import { BasePolicy } from '@adonisjs/bouncer'
import type User from '#users/models/user'
import type { HttpContext } from '@adonisjs/core/http'
import factionConfig from '#config/faction'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class DashboardPolicy extends BasePolicy {
  async access(user: User, ctx: HttpContext): Promise<AuthorizerResponse> {
    const currentCharacter = await ctx.characters.getCurrentCharacter()

    if (!currentCharacter) {
      return false
    }

    try {
      return await ctx.factions.characterHasMinRank(
        currentCharacter.id,
        factionConfig.factionId,
        factionConfig.minimalRankDashboardAccess
      )
    } catch (err) {
      ctx.logger.error({ err, userId: user?.id }, 'Failed to check ability for dashboard access')
      return false
    }
  }
}
