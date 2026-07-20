export type Character = {
  id: number
  firstname: string
  lastname: string
  bankRoutingNumber: string
}

export type CharacterWithFaction = Character & {
  faction: Faction | null
}

export type Faction = {
  id: number
  name: string
  rank: number
  rankName: string
}
