import type { ApplicationService } from '@adonisjs/core/types'
import { CharacterCacheService } from '#auth/services/character_cache_service'
import { FactionCacheService } from '#auth/services/faction_cache_service'

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    characterCache: CharacterCacheService
    factionCache: FactionCacheService
  }
}

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  async register() {
    this.app.container.singleton('characterCache', function () {
      return new CharacterCacheService()
    })

    this.app.container.singleton('factionCache', function () {
      return new FactionCacheService()
    })
  }

  /**
   * The container bindings have booted
   */
  async boot() {
    await import('../extensions/http_context_extension.js')
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
  async shutdown() {
    const cacheService = await this.app.container.make('characterCache')
    cacheService.stopCleanupInterval()

    const factionCache = await this.app.container.make('factionCache')
    factionCache.stopCleanupInterval()
  }
}
