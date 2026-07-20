export type GTAWClientFetchFactionsResponse = {
  data: { [characterId: number]: GTAWApiFaction }
}

export type GTAWApiFaction = {
  faction: number
  faction_name: string
  faction_rank: number
  faction_rank_name: string
}
