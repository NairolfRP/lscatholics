import { HttpContext } from '@adonisjs/core/http'
import CharacterService from '#characters/services/character_service'
import { FactionService } from '#characters/services/faction_service'

declare module '@adonisjs/core/http' {
  export interface HttpContext {
    characters: CharacterService
    factions: FactionService
  }
}

HttpContext.getter(
  'characters',
  function (this: HttpContext) {
    return new CharacterService(this)
  },
  true
)

HttpContext.getter(
  'factions',
  function (this: HttpContext) {
    return new FactionService(this)
  },
  true
)
