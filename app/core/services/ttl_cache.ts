import logger from '@adonisjs/core/services/logger'

type CacheEntry<T> = {
  data: T
  expiresAt: number
}

export class TtlCache<T> {
  private readonly store = new Map<string, CacheEntry<T>>()
  private cleanupTimer?: NodeJS.Timeout

  constructor(
    private readonly ttlMs: number,
    private readonly cleanupIntervalMs: number = 60_000,
    private readonly label: string = 'TtlCache'
  ) {
    this.startCleanup()
  }

  get(key: string): T | undefined {
    const entry = this.store.get(key)
    if (!entry) return undefined

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return undefined
    }

    return entry.data
  }

  set(key: string, data: T, ttlMs = this.ttlMs): void {
    this.store.set(key, { data, expiresAt: Date.now() + ttlMs })
  }

  delete(key: string): boolean {
    return this.store.delete(key)
  }

  has(key: string): boolean {
    return this.get(key) !== undefined
  }

  async getOrFetch(key: string, fetchFn: () => Promise<T>): Promise<T> {
    const cached = this.get(key)
    if (cached !== undefined) return cached

    const data = await fetchFn()
    this.set(key, data)
    return data
  }

  async forceRefresh(key: string, fetchFn: () => Promise<T>): Promise<T> {
    this.delete(key)
    return this.getOrFetch(key, fetchFn)
  }

  cleanup(): void {
    const now = Date.now()
    let deleted = 0

    for (const [key, entry] of this.store) {
      if (now > entry.expiresAt) {
        this.store.delete(key)
        deleted++
      }
    }

    if (deleted > 0) {
      logger.debug(`[${this.label}] cleanup: ${deleted} expired entries removed`)
    }
  }

  stop(): void {
    clearInterval(this.cleanupTimer)
    this.cleanupTimer = undefined
  }

  clear(): void {
    this.store.clear()
  }

  get size(): number {
    return this.store.size
  }

  stats(): { total: number; valid: number; expired: number } {
    const now = Date.now()
    let valid = 0
    let expired = 0

    for (const entry of this.store.values()) {
      if (now <= entry.expiresAt) valid++
      else expired++
    }

    return { total: this.store.size, valid, expired }
  }

  private startCleanup(): void {
    this.cleanupTimer = setInterval(() => this.cleanup(), this.cleanupIntervalMs)
    this.cleanupTimer.unref?.()
  }
}
