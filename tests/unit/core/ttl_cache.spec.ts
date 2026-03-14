import { test } from '@japa/runner'
import { TtlCache } from '#core/services/ttl_cache'

test.group('TtlCache', () => {
  test('returns undefined for a missing key', ({ assert }) => {
    const cache = new TtlCache({ ttlMs: 1000 })
    assert.isUndefined(cache.get('missing'))
  })

  test('returns the value before expiration', ({ assert }) => {
    const cache = new TtlCache({ ttlMs: 5000 })
    cache.set('key', 'value')
    assert.equal(cache.get('key'), 'value')
  })

  test('returns undefined after expiration', async ({ assert }) => {
    const cache = new TtlCache({ ttlMs: 10 })
    cache.set('key', 'value')
    await new Promise((r) => setTimeout(r, 20))
    assert.isUndefined(cache.get('key'))
  })

  test('per-key ttl overrides the default ttl', async ({ assert }) => {
    const cache = new TtlCache({ ttlMs: 5000 })
    cache.set('key', 'value', 10)
    await new Promise((r) => setTimeout(r, 20))
    assert.isUndefined(cache.get('key'))
  })

  test('getOrFetch calls fetchFn on cache miss', async ({ assert }) => {
    const cache = new TtlCache<number>({ ttlMs: 5000 })
    let calls = 0
    const result = await cache.getOrFetch('key', async () => {
      calls++
      return 42
    })
    assert.equal(result, 42)
    assert.equal(calls, 1)
  })

  test('getOrFetch does not call fetchFn on cache hit', async ({ assert }) => {
    const cache = new TtlCache<number>({ ttlMs: 5000 })
    let calls = 0
    const fetch = async () => {
      calls++
      return 42
    }
    await cache.getOrFetch('key', fetch)
    await cache.getOrFetch('key', fetch)
    assert.equal(calls, 1)
  })

  test('evicts the oldest entry when maxSize is reached', ({ assert }) => {
    const cache = new TtlCache<number>({ ttlMs: 5000, maxSize: 2 })
    cache.set('a', 1)
    cache.set('b', 2)
    cache.set('c', 3) // should evict 'a'
    assert.isUndefined(cache.get('a'))
    assert.equal(cache.get('b'), 2)
    assert.equal(cache.get('c'), 3)
  })

  test('forceRefresh invalidates the cache and refetches', async ({ assert }) => {
    const cache = new TtlCache<number>({ ttlMs: 5000 })
    await cache.getOrFetch('key', async () => 1)
    const result = await cache.forceRefresh('key', async () => 2)
    assert.equal(result, 2)
    assert.equal(cache.get('key'), 2)
  })

  test('cleanup removes expired entries', async ({ assert }) => {
    const cache = new TtlCache<string>({ ttlMs: 10 })
    cache.set('a', 'x')
    cache.set('b', 'y')
    await new Promise((r) => setTimeout(r, 20))
    cache.cleanup()
    assert.equal(cache.size, 0)
  })

  test('stats returns consistent metrics', async ({ assert }) => {
    const cache = new TtlCache<number>({ ttlMs: 10, maxSize: 100 })
    cache.set('valid', 1, 5000)
    cache.set('expired', 2, 1)
    await new Promise((r) => setTimeout(r, 20))

    const stats = cache.stats()
    assert.equal(stats.valid, 1)
    assert.equal(stats.expired, 1)
    assert.equal(stats.maxSize, 100)
  })
})
