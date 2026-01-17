import { CharacterFaction, FactionCacheEntry } from '#auth/types/faction'
import { DateTime } from 'luxon'
import logger from '@adonisjs/core/services/logger'

export class FactionCacheService {
  private cache = new Map<string, FactionCacheEntry>()
  private readonly DEFAULT_TTL = 5 * 60 * 1000
  private cleanupInterval?: NodeJS.Timeout

  constructor() {
    this.startCleanupInterval()
  }

  cacheFactions(userId: string, factions: CharacterFaction[]) {
    const cacheKey = `user_factions:${userId}`
    const ttl = this.DEFAULT_TTL

    this.cache.set(cacheKey, {
      data: factions,
      timestamp: DateTime.now(),
      ttl,
    })

    logger.debug(`Cached factions for user ${userId} with TTL ${ttl}s`)
  }

  async getCachedUserFactions(
    userId: string,
    fetchFn: () => Promise<CharacterFaction[]>
  ): Promise<CharacterFaction[]> {
    const cacheKey = `user_factions:${userId}`
    const entry = this.cache.get(cacheKey)

    if (entry && DateTime.now().diff(entry.timestamp).as('seconds') < entry.ttl) {
      logger.debug(
        `Cache hit for user ${userId} (age: ${DateTime.now().diff(entry.timestamp).as('seconds')}s)`
      )
      return entry.data
    }

    return this.fetchAndCache(userId, fetchFn)
  }

  private async fetchAndCache(
    userId: string,
    fetchFn: () => Promise<CharacterFaction[]>
  ): Promise<CharacterFaction[]> {
    logger.debug(`Fetching factions from API for user ${userId}`)
    const factions = await fetchFn()
    this.cacheFactions(userId, factions)
    return factions
  }

  async forceRefresh(
    userId: string,
    fetchFn: () => Promise<CharacterFaction[]>
  ): Promise<CharacterFaction[]> {
    logger.info(`Force refresh factions for user ${userId}`)
    this.invalidateUserFactions(userId)
    return this.fetchAndCache(userId, fetchFn)
  }

  invalidateUserFactions(userId: string): void {
    const cacheKey = `user_factions:${userId}`
    const deleted = this.cache.delete(cacheKey)

    if (deleted) {
      logger.info(`Invalidated faction cache for user ${userId}`)
    }
  }

  isCacheValid(userId: string): boolean {
    const cacheKey = `user_factions:${userId}`
    const entry = this.cache.get(cacheKey)

    if (!entry) {
      return false
    }

    return DateTime.now().diff(entry.timestamp).as('seconds') < entry.ttl
  }

  getCacheAge(userId: string): number | null {
    const cacheKey = `user_factions:${userId}`
    const entry = this.cache.get(cacheKey)

    if (!entry) {
      return null
    }

    return DateTime.now().diff(entry.timestamp).as('seconds')
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
      logger.info(`Faction cache cleanup: %s expired entries removed`, deletedCount)
    }
  }

  private startCleanupInterval(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpired()
    }, 60 * 1000)
  }

  stopCleanupInterval(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = undefined
    }
  }

  getStats(): {
    totalEntries: number
    validEntries: number
    expiredEntries: number
    averageAge: number | null
  } {
    const now = DateTime.now()
    let validEntries = 0
    let expiredEntries = 0
    let totalAge = 0

    for (const entry of this.cache.values()) {
      const age = now.diff(entry.timestamp).as('seconds')
      totalAge += age

      if (age < entry.ttl) {
        validEntries++
      } else {
        expiredEntries++
      }
    }

    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries,
      averageAge: this.cache.size > 0 ? totalAge / this.cache.size : null,
    }
  }

  clear(): void {
    this.cache.clear()
    logger.info('Faction cache cleared')
  }
}
