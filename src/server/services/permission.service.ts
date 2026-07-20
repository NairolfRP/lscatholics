import { env } from '#/config/env.server'
import type { CharacterWithFaction } from '#/shared/types/character.types'
import { parseCsvString } from '#/utils/string'
import { logger } from '../integrations/logger'

export function checkCanAccessDashboard(
  userRoles?: string,
  currentCharacter?: CharacterWithFaction | null
): boolean {
  try {
    if (!currentCharacter) {
      return false
    }

    const roles = userRoles ? parseCsvString(userRoles) : []

    if (roles.includes('admin')) {
      return true
    }

    const faction = currentCharacter.faction

    if (!faction) {
      return false
    }

    return (
      faction.id === env.ROLEPLAY_FACTION_ID &&
      faction.rank >= env.ROLEPLAY_FACTION_MINIMAL_RANK_DASHBOARD_ACCESS
    )
  } catch (err) {
    logger.error({ err }, 'dashboardAccess.fetch.failed')

    return false
  }
}
