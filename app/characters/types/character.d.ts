import type { GTAWorldCharacter } from '@gtaw-oauth-providers/adonisjs-ally'

export type CharacterFromApi = GTAWorldCharacter

export type Character = Omit<GTAWorldCharacter, 'bank_routing_number'> & {
  bankRoutingNumber: string
}

export type CurrentCharacter = {
  id: number
  data: Character
  selectedAt: number
}
