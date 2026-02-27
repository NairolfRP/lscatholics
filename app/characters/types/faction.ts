import type { DateTime } from 'luxon'

export type CharacterFactionPayload = {
  faction: number
  faction_name: string
  faction_rank: number
  faction_rank_name: string
}

export type CharacterFactionsResponse = {
  [characterId: string]: CharacterFactionPayload
}

export type CharacterFaction = {
  characterId: number
  factionId: number
  factionName: string
  factionRank: number
  factionRankName: string
}

export type FactionCacheEntry = {
  data: CharacterFaction[]
  timestamp: DateTime
  ttl: number
}
