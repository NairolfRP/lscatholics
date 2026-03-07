import type { CharacterFaction } from '#characters/types/faction'
import { TtlCache } from '#core/services/ttl_cache'

export class FactionCacheService {
  readonly #cache = new TtlCache<CharacterFaction[]>({
    ttlMs: 5 * 60_000,
    cleanupIntervalMs: 60_000,
    label: 'FactionCache',
    maxSize: 2000,
  })

  #key(userId: string): string {
    return `user_factions:${userId}`
  }

  cacheFactions(userId: string, factions: CharacterFaction[], ttlMs?: number): void {
    this.#cache.set(this.#key(userId), factions, ttlMs)
  }

  getCachedUserFactions(
    userId: string,
    fetchFn: () => Promise<CharacterFaction[]>
  ): Promise<CharacterFaction[]> {
    return this.#cache.getOrFetch(this.#key(userId), fetchFn)
  }

  forceRefresh(
    userId: string,
    fetchFn: () => Promise<CharacterFaction[]>
  ): Promise<CharacterFaction[]> {
    return this.#cache.forceRefresh(this.#key(userId), fetchFn)
  }

  invalidateUserFactions(userId: string): void {
    this.#cache.delete(this.#key(userId))
  }

  isCacheValid(userId: string): boolean {
    return this.#cache.has(this.#key(userId))
  }

  cleanupExpired(): void {
    this.#cache.cleanup()
  }

  stopCleanupInterval(): void {
    this.#cache.stop()
  }

  getStats() {
    return this.#cache.stats()
  }

  clear(): void {
    this.#cache.clear()
  }
}
