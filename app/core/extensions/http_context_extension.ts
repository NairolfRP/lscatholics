import { HttpContext } from '@adonisjs/core/http'
import CharacterService from '#auth/services/character_service'

declare module '@adonisjs/core/http' {
  export interface HttpContext {
    characters: CharacterService
  }
}

HttpContext.getter('characters', function (this: HttpContext) {
  return new CharacterService(this)
})
