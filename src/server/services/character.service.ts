import type { GTAWCharacter } from '@gtaw-oauth-providers/better-auth'
import type { Character, CharacterWithFaction, Faction } from '#/shared/types/character.types'
import type { GTAWApiFaction } from '#/shared/types/gtaw-client.types'
import { getAccessToken } from './auth.service'
import { gtawClient } from './gtaw-client.service'

export async function getAllUserCharacters(
  accessToken?: string,
  options?: { forceRefresh?: boolean }
): Promise<Array<Character>> {
  if (!accessToken) {
    const result = await getAccessToken()
    accessToken = result.accessToken
  }
  let characters
  if (options?.forceRefresh) {
    const forceRefreshResult = await gtawClient.forceRefresh(accessToken, ['characters'])
    characters = forceRefreshResult.characters
  } else {
    characters = await gtawClient.fetchUserCharacters(accessToken)
  }

  if (characters.length === 0) {
    return []
  }

  return characters.map((char) => remapCharacter(char))
}

export async function getAllUserCharactersWithFactions(
  accessToken?: string,
  options?: { forceRefresh?: boolean }
): Promise<Array<CharacterWithFaction>> {
  if (!accessToken) {
    const result = await getAccessToken()
    accessToken = result.accessToken
  }

  const characters = await getAllUserCharacters(accessToken, options)

  if (characters.length === 0) {
    return []
  }

  const factions = await getCharactersFactions(accessToken, options)

  return characters.map((char) => ({
    ...char,
    faction: factions && `${char.id}` in factions ? factions[`${char.id}`] : null,
  }))
}

export async function getCharactersFactions(
  accessToken?: string,
  options?: { forceRefresh?: boolean }
): Promise<{ [characterId: string]: Faction } | null> {
  if (!accessToken) {
    const result = await getAccessToken()
    accessToken = result.accessToken
  }

  let factions
  if (options?.forceRefresh) {
    const forceRefreshResult = await gtawClient.forceRefresh(accessToken, ['factions'])
    factions = forceRefreshResult.factions
  } else {
    factions = await gtawClient.fetchUserFactions(accessToken)
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
    bankRoutingNumber: character.bankRoutingNumber,
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
