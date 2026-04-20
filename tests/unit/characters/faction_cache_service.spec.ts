import { test } from '@japa/runner'
import { FactionCacheService } from '#characters/services/faction_cache_service'
import type { CharacterFaction } from '#characters/types/faction'

const SAMPLE_FACTIONS: CharacterFaction[] = [
  {
    characterId: 1,
    factionId: 563,
    factionName: 'LSPD',
    factionRank: 10,
    factionRankName: 'Sergeant',
  },
  {
    characterId: 2,
    factionId: 563,
    factionName: 'LSPD',
    factionRank: 5,
    factionRankName: 'Officer',
  },
]

test.group('FactionCacheService', (group) => {
  let service: FactionCacheService

  group.each.setup(() => {
    service = new FactionCacheService()
  })

  group.each.teardown(() => {
    service.clear()
    service.stopCleanupInterval()
  })

  // -------------------------
  // cacheFactions / isCacheValid
  // -------------------------

  test('should cache factions and mark cache as valid', ({ assert }) => {
    assert.isFalse(service.isCacheValid('user:1'))

    service.cacheFactions('1', SAMPLE_FACTIONS)

    assert.isTrue(service.isCacheValid('1'))
  })

  test('should invalidate cache for a user', ({ assert }) => {
    service.cacheFactions('1', SAMPLE_FACTIONS)
    assert.isTrue(service.isCacheValid('1'))

    service.invalidateUserFactions('1')

    assert.isFalse(service.isCacheValid('1'))
  })

  test('should not affect other users when invalidating', ({ assert }) => {
    service.cacheFactions('1', SAMPLE_FACTIONS)
    service.cacheFactions('2', SAMPLE_FACTIONS)

    service.invalidateUserFactions('1')

    assert.isFalse(service.isCacheValid('1'))
    assert.isTrue(service.isCacheValid('2'))
  })

  // -------------------------
  // getCachedUserFactions
  // -------------------------

  test('should call fetchFn on first call and cache the result', async ({ assert }) => {
    let callCount = 0
    const fetchFn = async () => {
      callCount++
      return SAMPLE_FACTIONS
    }

    const result = await service.getCachedUserFactions('1', fetchFn)

    assert.equal(callCount, 1)
    assert.deepEqual(result, SAMPLE_FACTIONS)
    assert.isTrue(service.isCacheValid('1'))
  })

  test('should not call fetchFn on subsequent calls if cache is valid', async ({ assert }) => {
    let callCount = 0
    const fetchFn = async () => {
      callCount++
      return SAMPLE_FACTIONS
    }

    await service.getCachedUserFactions('1', fetchFn)
    await service.getCachedUserFactions('1', fetchFn)
    await service.getCachedUserFactions('1', fetchFn)

    assert.equal(callCount, 1)
  })

  test('should propagate fetchFn errors without caching them', async ({ assert }) => {
    const fetchFn = async () => {
      throw new Error('API 500')
    }

    await assert.rejects(() => service.getCachedUserFactions('1', fetchFn), 'API 500')
    assert.isFalse(service.isCacheValid('1'))
  })

  test('should retry fetchFn after an error', async ({ assert }) => {
    let callCount = 0
    const fetchFn = async () => {
      callCount++
      if (callCount === 1) throw new Error('API 500')
      return SAMPLE_FACTIONS
    }

    await assert.rejects(() => service.getCachedUserFactions('1', fetchFn))
    const result = await service.getCachedUserFactions('1', fetchFn)

    assert.equal(callCount, 2)
    assert.deepEqual(result, SAMPLE_FACTIONS)
  })

  // -------------------------
  // forceRefresh
  // -------------------------

  test('should bypass cache and call fetchFn on forceRefresh', async ({ assert }) => {
    let callCount = 0
    const fetchFn = async () => {
      callCount++
      return SAMPLE_FACTIONS
    }

    await service.getCachedUserFactions('1', fetchFn)
    await service.forceRefresh('1', fetchFn)

    assert.equal(callCount, 2)
  })

  test('should update cache after forceRefresh', async ({ assert }) => {
    const oldFactions: CharacterFaction[] = [{ ...SAMPLE_FACTIONS[0], factionRank: 1 }]
    const newFactions: CharacterFaction[] = [{ ...SAMPLE_FACTIONS[0], factionRank: 15 }]

    await service.getCachedUserFactions('1', async () => oldFactions)
    const result = await service.forceRefresh('1', async () => newFactions)

    assert.equal(result[0].factionRank, 15)
  })

  // -------------------------
  // clear / getStats
  // -------------------------

  test('should clear all cached entries', ({ assert }) => {
    service.cacheFactions('1', SAMPLE_FACTIONS)
    service.cacheFactions('2', SAMPLE_FACTIONS)

    service.clear()

    assert.isFalse(service.isCacheValid('1'))
    assert.isFalse(service.isCacheValid('2'))
  })

  test('getStats should return cache statistics', ({ assert }) => {
    service.cacheFactions('1', SAMPLE_FACTIONS)

    const stats = service.getStats()

    assert.isDefined(stats)
    assert.isNumber(stats.total)
    assert.isTrue(stats.total >= 1)
  })
})
