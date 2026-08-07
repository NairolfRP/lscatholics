import { describe, expect, it } from 'vitest'
import {
  NOT_FOUND_CACHE_MAX_ENTRIES,
  NOT_FOUND_CACHE_TTL_MS,
  NotFoundCache,
} from '#server/payments/not-found-cache.ts'

describe('NotFoundCache', () => {
  it('remembers an id and forgets it after the TTL', () => {
    const cache = new NotFoundCache()
    const now = 1_000_000

    cache.set('pay_1', now)
    expect(cache.has('pay_1', now)).toBe(true)
    expect(cache.has('pay_1', now + NOT_FOUND_CACHE_TTL_MS + 1)).toBe(false)
  })

  it('evicts the oldest entry when the cap is reached', () => {
    const cache = new NotFoundCache()
    const now = 1_000_000

    for (let i = 0; i < NOT_FOUND_CACHE_MAX_ENTRIES; i++) {
      cache.set(`pay_${i}`, now + i)
    }

    cache.set('pay_new', now + NOT_FOUND_CACHE_MAX_ENTRIES)

    expect(cache.has('pay_new', now + NOT_FOUND_CACHE_MAX_ENTRIES)).toBe(true)
    expect(cache.has('pay_0', now + NOT_FOUND_CACHE_MAX_ENTRIES)).toBe(false)
    expect(cache.has('pay_1', now + NOT_FOUND_CACHE_MAX_ENTRIES)).toBe(true)
  })

  it('does not evict an existing id when at capacity', () => {
    const cache = new NotFoundCache()
    const now = 1_000_000

    for (let i = 0; i < NOT_FOUND_CACHE_MAX_ENTRIES; i++) {
      cache.set(`pay_${i}`, now)
    }

    cache.set('pay_5', now + 1)

    expect(cache.has('pay_5', now + 1)).toBe(true)
    expect(cache.has('pay_0', now + 1)).toBe(true)
  })
})
