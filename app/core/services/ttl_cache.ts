import logger from '@adonisjs/core/services/logger'

type CacheEntry<T> = {
  data: T
  expiresAt: number
}

type TtlCacheOptions = {
  ttlMs: number
  cleanupIntervalMs?: number
  label?: string
  maxSize?: number
}

export class TtlCache<T> {
  readonly #store = new Map<string, CacheEntry<T>>()
  #cleanupTimer?: NodeJS.Timeout

  readonly #ttlMs: number
  readonly #cleanupIntervalMs: number
  readonly #label: string
  readonly #maxSize: number

  constructor(options: TtlCacheOptions)
  constructor(ttlMs: number, cleanupIntervalMs?: number, label?: string)
  constructor(
    optionsOrTtl: TtlCacheOptions | number,
    cleanupIntervalMs: number = 60_000,
    label: string = 'TtlCache'
  ) {
    if (typeof optionsOrTtl === 'object') {
      this.#ttlMs = optionsOrTtl.ttlMs
      this.#cleanupIntervalMs = optionsOrTtl.cleanupIntervalMs ?? 60_000
      this.#label = optionsOrTtl.label ?? 'TtlCache'
      this.#maxSize = optionsOrTtl.maxSize ?? 1000
    } else {
      this.#ttlMs = optionsOrTtl
      this.#cleanupIntervalMs = cleanupIntervalMs
      this.#label = label
      this.#maxSize = 1000
    }

    this.#startCleanup()
  }

  get(key: string): T | undefined {
    const entry = this.#store.get(key)
    if (!entry) return undefined

    if (Date.now() > entry.expiresAt) {
      this.#store.delete(key)
      return undefined
    }

    return entry.data
  }

  set(key: string, data: T, ttlMs = this.#ttlMs): void {
    if (!this.#store.has(key) && this.#store.size >= this.#maxSize) {
      this.#evictOldest()
    }

    this.#store.set(key, { data, expiresAt: Date.now() + ttlMs })
  }

  delete(key: string): boolean {
    return this.#store.delete(key)
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

    for (const [key, entry] of this.#store) {
      if (now > entry.expiresAt) {
        this.#store.delete(key)
        deleted++
      }
    }

    if (deleted > 0) {
      logger.debug(`[${this.#label}] cleanup: ${deleted} expired entries removed`)
    }
  }

  stop(): void {
    clearInterval(this.#cleanupTimer)
    this.#cleanupTimer = undefined
  }

  clear(): void {
    this.#store.clear()
  }

  get size(): number {
    return this.#store.size
  }

  stats(): { total: number; valid: number; expired: number; maxSize: number; usage: string } {
    const now = Date.now()
    let valid = 0
    let expired = 0

    for (const entry of this.#store.values()) {
      if (now <= entry.expiresAt) valid++
      else expired++
    }

    return {
      total: this.#store.size,
      valid,
      expired,
      maxSize: this.#maxSize,
      usage: `${this.#store.size}/${this.#maxSize} (${Math.round((this.#store.size / this.#maxSize) * 100)}%)`,
    }
  }

  #evictOldest() {
    const firstKey = this.#store.keys().next().value
    if (firstKey !== undefined) {
      this.#store.delete(firstKey)
      logger.debug(`[${this.#label}] evicted oldest entry (maxSize=${this.#maxSize} reached)`)
    }
  }

  #startCleanup(): void {
    this.#cleanupTimer = setInterval(() => this.cleanup(), this.#cleanupIntervalMs)
    this.#cleanupTimer.unref?.()
  }
}
