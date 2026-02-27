/*
|--------------------------------------------------------------------------
| Bouncer abilities
|--------------------------------------------------------------------------
|
| You may export multiple abilities from this file and pre-register them
| when creating the Bouncer instance.
|
| Pre-registered policies and abilities can be referenced as a string by their
| name. Also they are must if want to perform authorization inside Edge
| templates.
|
*/

import { Bouncer } from '@adonisjs/bouncer'
import type User from '#users/models/user'
import type { HttpContext } from '@adonisjs/core/http'
import factionConfig from '#config/faction'

export const dashboardAccessAbility = Bouncer.ability(async (_user: User, ctx: HttpContext) => {
  try {
    const currentCharacter = await ctx.characters.getCurrentCharacter()

    if (!currentCharacter) {
      throw new Error('Failed to determine current character')
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
})
