import type { GTAWCharacter } from '@gtaw-oauth-providers/better-auth'
import type { Character, CharacterWithFaction, Faction } from '#/shared/types/character.types'
import type { GTAWApiFaction } from '#/shared/types/gtaw-client.types'
import { ensureSession, getAccessToken } from './auth.service'
import { gtawClient } from './gtaw-client.service'

export async function getAllUserCharacters(
  accessToken?: string,
  options?: { forceRefresh?: boolean }
): Promise<Character[]> {
  const session = await ensureSession()
  const userId = session.user.id

  if (!accessToken) {
    const result = await getAccessToken({ userId })
    accessToken = result.accessToken
  }
  let characters
  if (options?.forceRefresh) {
    const forceRefreshResult = await gtawClient.forceRefresh(userId, accessToken, ['characters'])
    characters = forceRefreshResult.characters
  } else {
    characters = await gtawClient.fetchUserCharacters(userId, accessToken)
  }

  if (characters.length === 0) {
    return []
  }

  return characters.map((char) => remapCharacter(char))
}

export async function getAllUserCharactersWithFactions(
  accessToken?: string,
  options?: { forceRefresh?: boolean }
): Promise<CharacterWithFaction[]> {
  const session = await ensureSession()
  const userId = session.user.id

  if (!accessToken) {
    const result = await getAccessToken({ userId })
    accessToken = result.accessToken
  }

  const [characters, factions] = await Promise.all([
    getAllUserCharacters(accessToken, options),
    getCharactersFactions(accessToken, options),
  ])

  if (characters.length === 0) {
    return []
  }

  return characters.map((char) => ({
    ...char,
    faction: factions && `${char.id}` in factions ? factions[`${char.id}`] : null,
  }))
}

export async function getCharactersFactions(
  accessToken?: string,
  options?: { forceRefresh?: boolean }
): Promise<{ [characterId: string]: Faction } | null> {
  const session = await ensureSession()
  const userId = session.user.id

  if (!accessToken) {
    const result = await getAccessToken({ userId })
    accessToken = result.accessToken
  }

  let factions
  if (options?.forceRefresh) {
    const forceRefreshResult = await gtawClient.forceRefresh(userId, accessToken, ['factions'])
    factions = forceRefreshResult.factions
  } else {
    factions = await gtawClient.fetchUserFactions(userId, accessToken)
  }

  // oxlint-disable-next-line typescript/no-unnecessary-condition
  if (!factions || Object.keys(factions).length === 0) return null

  const result: { [characterId: string]: Faction } = {}
  for (const [characterId, faction] of Object.entries(factions)) {
    result[characterId] = remapFaction(faction)
  }

  return result
}

export function remapCharacter(character: GTAWCharacter): Character {
  return {
    id: character.id,
    firstname: character.firstname,
    lastname: character.lastname,
    bankRoutingNumber: character.bank_routing_number,
  }
}

export function remapFaction(faction: GTAWApiFaction): Faction {
  return {
    id: faction.faction,
    name: faction.faction_name,
    rank: faction.faction_rank,
    rankName: faction.faction_rank_name,
  }
}
