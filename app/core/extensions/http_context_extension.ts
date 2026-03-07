import { HttpContext } from '@adonisjs/core/http'
import CharacterService from '#characters/services/character_service'
import { FactionService } from '#characters/services/faction_service'
import { INTENDED_URL_SESSION_KEY } from '#core/constants/intended_url.constants'

declare module '@adonisjs/core/http' {
  export interface HttpContext {
    characters: CharacterService
    factions: FactionService
    setIntendedUrl(url: string): void
    redirectToIntended(fallback?: string): void
  }
}

HttpContext.getter('characters', function (this: HttpContext) {
  return new CharacterService(this)
})

HttpContext.getter('factions', function (this: HttpContext) {
  return new FactionService(this)
})

HttpContext.instanceProperty('setIntendedUrl', function (this: HttpContext, url: string) {
  this.session.put(INTENDED_URL_SESSION_KEY, url)
})

HttpContext.instanceProperty(
  'redirectToIntended',
  function (this: HttpContext, fallback: string = '/') {
    const url = this.session.pull(INTENDED_URL_SESSION_KEY, fallback)
    this.response.redirect().toPath(url)
  }
)
