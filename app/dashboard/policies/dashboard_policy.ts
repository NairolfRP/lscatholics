import { BasePolicy } from '@adonisjs/bouncer'
import type User from '#users/models/user'
import type { HttpContext } from '@adonisjs/core/http'
import factionConfig from '#config/faction'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'
import { Exception } from '@adonisjs/core/exceptions'

export default class DashboardPolicy extends BasePolicy {
  async access(_user: User, ctx: HttpContext): Promise<AuthorizerResponse> {
    try {
      const currentCharacter = await ctx.characters.getCurrentCharacter()

      if (!currentCharacter) {
        throw new Exception('Failed to determine current character', { status: 500 })
      }

      return await ctx.factions.characterHasMinRank(
        currentCharacter.id,
        factionConfig.factionId,
        factionConfig.minimalRankDashboardAccess
      )
    } catch (err) {
      ctx.logger.error({ err }, 'Failed to check ability for dashboard access')
      return false
    }
  }
}
