import type { ApplicationService } from '@adonisjs/core/types'
import { CharacterCacheService } from '#characters/services/character_cache_service'
import { FactionCacheService } from '#characters/services/faction_cache_service'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {
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
  async shutdown() {
    const [characterCache, factionCache] = await Promise.all([
      this.app.container.make('characterCache'),
      this.app.container.make('factionCache'),
    ])

    characterCache.stopCleanupInterval()
    factionCache.stopCleanupInterval()
  }
}

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    characterCache: CharacterCacheService
    factionCache: FactionCacheService
  }
}
