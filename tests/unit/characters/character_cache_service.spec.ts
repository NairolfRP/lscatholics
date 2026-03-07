import { test } from '@japa/runner'
import { CharacterCacheService } from '#characters/services/character_cache_service'
import type { GTAWorldCharacter } from '@gtaw-oauth-providers/adonisjs-ally'

const mockCharacters: GTAWorldCharacter[] = [
  {
    id: 1,
    firstname: 'John',
    lastname: 'Doe',
    memberid: 12345,
  },
  {
    id: 2,
    firstname: 'Jane',
    lastname: 'Smith',
    memberid: 12346,
  },
]

test.group('Character Cache Service', (group) => {
  let cacheService: CharacterCacheService

  group.each.setup(() => {
    cacheService = new CharacterCacheService()
  })

  group.each.teardown(() => {
    cacheService.stopCleanupInterval()
    cacheService.clear()
  })

  test('should cache characters for a user', async ({ assert }) => {
    const userId = 'user123'

    cacheService.cacheCharacters(userId, mockCharacters)

    const result = await cacheService.getCachedUserCharacters(userId, async () => [])

    assert.deepEqual(result, mockCharacters)
  })

  test('should return fresh data when cache is expired', async ({ assert }) => {
    const userId = 'user123'
    const oldCharacters = [mockCharacters[0]]
    const newCharacters = mockCharacters

    cacheService.cacheCharacters(userId, oldCharacters, -1)

    const result = await cacheService.getCachedUserCharacters(userId, async () => newCharacters)

    assert.deepEqual(result, newCharacters)
  })

  test('should invalidate user characters cache', async ({ assert }) => {
    const userId = 'user123'

    cacheService.cacheCharacters(userId, mockCharacters)
    cacheService.invalidateUserCharacters(userId)

    let fetchCalled = false
    await cacheService.getCachedUserCharacters(userId, async () => {
      fetchCalled = true
      return mockCharacters
    })

    assert.isTrue(fetchCalled)
  })

  test('should correctly identify if character is owned by user', async ({ assert }) => {
    const userId = 'user123'
    const fetchFn = async () => mockCharacters

    const isOwned = await cacheService.isCharacterOwnedByUser(userId, 1, fetchFn)
    const isNotOwned = await cacheService.isCharacterOwnedByUser(userId, 999, fetchFn)

    assert.isTrue(isOwned)
    assert.isFalse(isNotOwned)
  })

  test('should cleanup expired entries', async ({ assert }) => {
    cacheService.cacheCharacters('user1', mockCharacters, -1)
    cacheService.cacheCharacters('user2', mockCharacters)

    cacheService.cleanupExpired()

    const stats = cacheService.getStats()
    assert.equal(stats.total, 1)
    assert.equal(stats.valid, 1)
    assert.equal(stats.expired, 0)
  })

  test('should clear all cache entries', async ({ assert }) => {
    cacheService.cacheCharacters('user1', mockCharacters)
    cacheService.cacheCharacters('user2', mockCharacters)

    cacheService.clear()

    assert.equal(cacheService.getStats().total, 0)
  })
})
