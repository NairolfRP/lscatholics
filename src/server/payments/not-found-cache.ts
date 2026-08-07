/**
 * Short-lived cache of Fleeca payment ids that returned 404.
 *
 * A valid-but-unknown UUID polled repeatedly (e.g. by the donation callback
 * page) would otherwise burn the global 10 req/min rate budget of the Fleeca
 * API. Once a payment is confirmed missing, remember it briefly so subsequent
 * lookups are answered without a network call.
 */
export const NOT_FOUND_CACHE_TTL_MS = 30_000

/** Upper bound on cached ids, so a flood of distinct 404s cannot grow unbounded. */
export const NOT_FOUND_CACHE_MAX_ENTRIES = 1_000

export class NotFoundCache {
  readonly #entries = new Map<string, number>()

  has(paymentId: string, now = Date.now()): boolean {
    const cachedAt = this.#entries.get(paymentId)
    if (cachedAt === undefined) return false
    if (now - cachedAt > NOT_FOUND_CACHE_TTL_MS) {
      this.#entries.delete(paymentId)
      return false
    }
    return true
  }

  set(paymentId: string, now = Date.now()): void {
    if (this.#entries.size >= NOT_FOUND_CACHE_MAX_ENTRIES && !this.#entries.has(paymentId)) {
      // Evict the oldest entry to keep the cache bounded.
      const oldest = this.#entries.keys().next().value
      if (oldest !== undefined) {
        this.#entries.delete(oldest)
      }
    }
    this.#entries.set(paymentId, now)
  }

  /** Resets all entries. Used between test cases. */
  clear(): void {
    this.#entries.clear()
  }
}

export const notFoundCache = new NotFoundCache()
