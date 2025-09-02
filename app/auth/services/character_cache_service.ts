import { DateTime } from 'luxon'
import type { Character } from '#auth/types/character'
import logger from '@adonisjs/core/services/logger'

type CharacterCacheEntry = {
  data: Character[]
  timestamp: DateTime
  ttl: number
}

export class CharacterCacheService {
  private cache = new Map<string, CharacterCacheEntry>()
  private readonly DEFAULT_TTL = 5 * 60
  private cleanupInterval?: NodeJS.Timeout

  constructor() {
    this.startCleanupInterval()
  }

  cacheCharacters(userId: string, characters: Character[]) {
    const cacheKey = `user_characters:${userId}`
    this.cache.set(cacheKey, {
      data: characters,
      timestamp: DateTime.now(),
      ttl: this.DEFAULT_TTL,
    })
  }

  async getCachedUserCharacters(
    userId: string,
    fetchFn: () => Promise<Character[]>
  ): Promise<Character[]> {
    const cacheKey = `user_characters:${userId}`
    const entry = this.cache.get(cacheKey)

    if (entry && DateTime.now().diff(entry.timestamp).as('seconds') < entry.ttl) {
      return entry.data
    }

    const characters = await fetchFn()

    this.cacheCharacters(userId, characters)

    return characters
  }

  invalidateUserCharacters(userId: string): void {
    const cacheKey = `user_characters:${userId}`
    this.cache.delete(cacheKey)
  }

  async isCharacterOwnedByUser(
    userId: string,
    characterId: number,
    fetchFn: () => Promise<Character[]>
  ): Promise<boolean> {
    const characters = await this.getCachedUserCharacters(userId, fetchFn)
    return characters.some((character) => character.id === characterId)
  }

  cleanupExpired(): void {
    const now = DateTime.now()
    let deletedCount = 0

    for (const [key, entry] of this.cache.entries()) {
      if (now.diff(entry.timestamp).as('seconds') >= entry.ttl) {
        this.cache.delete(key)
        deletedCount++
      }
    }

    if (deletedCount > 0) {
      logger.info(`Cache cleanup: ${deletedCount} expired entries removed`)
    }
  }

  private startCleanupInterval(): void {
    this.cleanupInterval = setInterval(
      () => {
        this.cleanupExpired()
      },
      10 * 60 * 1000
    )
  }

  stopCleanupInterval(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = undefined
    }
  }

  getStats(): { totalEntries: number; validEntries: number; expiredEntries: number } {
    const now = DateTime.now()
    let validEntries = 0
    let expiredEntries = 0

    for (const entry of this.cache.values()) {
      if (now.diff(entry.timestamp).as('seconds') < entry.ttl) {
        validEntries++
      } else {
        expiredEntries++
      }
    }

    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries,
    }
  }

  clear(): void {
    this.cache.clear()
  }
}
