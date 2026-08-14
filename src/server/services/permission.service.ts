import { env } from '#/config/env.server'
import { ROLE_PERMISSIONS } from '#/shared/integrations/auth/access-control'
import type { CharacterWithFaction } from '#/shared/types/character.types'
import { parseCsvString } from '#/utils/string'

export type PermissionMap = Record<string, string[]>

const FACTION_RANK_RULES = [
  {
    factionId: env.ROLEPLAY_FACTION_ID,
    minRank: env.ROLEPLAY_FACTION_MINIMAL_RANK_DASHBOARD_ACCESS,
    permission: {
      dashboard: ['access'],
      post: ['read', 'create'],
      event: ['read', 'create', 'update', 'delete'],
    },
  },
  {
    factionId: env.ROLEPLAY_FACTION_ID,
    minRank: env.ROLEPLAY_FACTION_LOWEST_SUPERVISOR_RANK,
    permission: { dashboard: ['supervise'] },
  },
  {
    factionId: env.ROLEPLAY_FACTION_ID,
    minRank: env.ROLEPLAY_FACTION_LOWEST_LEADERSHIP_RANK,
    permission: { dashboard: ['manage'] },
  },
  {
    factionId: env.ROLEPLAY_FACTION_ID,
    minRank: env.ROLEPLAY_FACTION_MINIMAL_RANK_FINANCES,
    permission: { finances: ['read', 'transaction'] },
  },
]

function mergePermissions(base: PermissionMap, extra: PermissionMap): PermissionMap {
  const result = { ...base }
  for (const [resource, actions] of Object.entries(extra)) {
    result[resource] = [...new Set([...(result[resource] ?? []), ...actions])]
  }
  return result
}

function isRoleName(name: string): name is keyof typeof ROLE_PERMISSIONS {
  return name in ROLE_PERMISSIONS
}

function resolveRolePermissions(userRole: string): PermissionMap {
  const roleNames = parseCsvString(userRole)
  const result: PermissionMap = {}
  for (const name of roleNames) {
    if (!isRoleName(name)) continue
    const perms = ROLE_PERMISSIONS[name]
    for (const [resource, actions] of Object.entries(perms)) {
      result[resource] = [...new Set([...(result[resource] ?? []), ...(actions as string[])])]
    }
  }
  return result
}

function resolveFactionPermissions(character: CharacterWithFaction | null): PermissionMap {
  if (!character?.faction) return {}
  const result: PermissionMap = {}
  for (const rule of FACTION_RANK_RULES) {
    if (character.faction.id === rule.factionId && character.faction.rank >= rule.minRank) {
      for (const [resource, actions] of Object.entries(rule.permission)) {
        result[resource] = [...new Set([...(result[resource] ?? []), ...actions])]
      }
    }
  }
  return result
}

export function resolvePermissions(
  userRole: string | undefined,
  currentCharacter: CharacterWithFaction | null
): PermissionMap {
  return mergePermissions(
    resolveRolePermissions(userRole ?? 'user'),
    resolveFactionPermissions(currentCharacter)
  )
}
