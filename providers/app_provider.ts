import type { ApplicationService } from '@adonisjs/core/types'
import { CharacterCacheService } from '#characters/services/character_cache_service'
import { FactionCacheService } from '#characters/services/faction_cache_service'

export default class AppProvider {
  #characterCache?: CharacterCacheService
  #factionCache?: FactionCacheService

  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {
    this.app.container.singleton(CharacterCacheService, () => {
      this.#characterCache = new CharacterCacheService()
      return this.#characterCache
    })

    this.app.container.singleton(FactionCacheService, () => {
      this.#factionCache = new FactionCacheService()
      return this.#factionCache
    })
  }

  /**
   * The container bindings have booted
   */
  async boot() {
    await import('#core/extensions/http_context_extension')
  }

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  shutdown() {
    this.#characterCache?.stopCleanupInterval()
    this.#factionCache?.stopCleanupInterval()
  }
}
