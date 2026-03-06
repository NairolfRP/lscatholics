import type { Character } from '#characters/types/character'
import { TtlCache } from '#core/services/ttl_cache'

export class CharacterCacheService {
  #cache = new TtlCache<Character[]>(5 * 60_000, 10 * 60_000, 'CharacterCache')

  #key(userId: string): string {
    return `user_characters:${userId}`
  }

  cacheCharacters(userId: string, characters: Character[], ttlMs?: number): void {
    this.#cache.set(this.#key(userId), characters, ttlMs)
  }

  getCachedUserCharacters(
    userId: string,
    fetchFn: () => Promise<Character[]>
  ): Promise<Character[]> {
    return this.#cache.getOrFetch(this.#key(userId), fetchFn)
  }

  invalidateUserCharacters(userId: string): void {
    this.#cache.delete(this.#key(userId))
  }

  async isCharacterOwnedByUser(
    userId: string,
    characterId: number,
    fetchFn: () => Promise<Character[]>
  ): Promise<boolean> {
    const characters = await this.getCachedUserCharacters(userId, fetchFn)
    return characters.some((c) => c.id === characterId)
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
