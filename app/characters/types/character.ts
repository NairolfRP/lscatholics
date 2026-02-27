import type { GTAWorldCharacter } from '@gtaw-oauth-providers/adonisjs-ally'

export type Character = GTAWorldCharacter

export type CurrentCharacter = {
  id: number
  data: Character
  selectedAt: number
}
