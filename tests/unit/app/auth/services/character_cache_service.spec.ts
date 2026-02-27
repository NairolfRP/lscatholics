import { test } from '@japa/runner'
import { CharacterCacheService } from '#characters/services/character_cache_service'
import type { Character } from '#characters/types/character'
import { DateTime } from 'luxon'

const mockCharacters: Character[] = [
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

    const fetchFn = async () => mockCharacters
    const cachedCharacters = await cacheService.getCachedUserCharacters(userId, fetchFn)

    assert.deepEqual(cachedCharacters, mockCharacters)
  })

  test('should return fresh data when cache is expired', async ({ assert }) => {
    const userId = 'user123'
    const oldCharacters = [mockCharacters[0]]
    const newCharacters = mockCharacters

    cacheService.cacheCharacters(userId, oldCharacters)

    const cacheKey = `user_characters:${userId}`
    const expiredEntry = {
      data: oldCharacters,
      timestamp: DateTime.now().minus({ minutes: 10 }),
      ttl: 5 * 60,
    }
    cacheService['cache'].set(cacheKey, expiredEntry)

    const fetchFn = async () => newCharacters
    const result = await cacheService.getCachedUserCharacters(userId, fetchFn)

    assert.deepEqual(result, newCharacters)
  })

  test('should invalidate user characters cache', async ({ assert }) => {
    const userId = 'user123'

    cacheService.cacheCharacters(userId, mockCharacters)
    cacheService.invalidateUserCharacters(userId)

    let fetchCalled = false
    const fetchFn = async () => {
      fetchCalled = true
      return mockCharacters
    }

    await cacheService.getCachedUserCharacters(userId, fetchFn)

    assert.isTrue(fetchCalled, 'Fetch function should be called after cache invalidation')
  })

  test('should correctly identify if character is owned by user', async ({ assert }) => {
    const userId = 'user123'
    const characterId = 1

    const fetchFn = async () => mockCharacters

    const isOwned = await cacheService.isCharacterOwnedByUser(userId, characterId, fetchFn)
    const isNotOwned = await cacheService.isCharacterOwnedByUser(userId, 999, fetchFn)

    assert.isTrue(isOwned)
    assert.isFalse(isNotOwned)
  })

  test('should cleanup expired entries', async ({ assert }) => {
    const userId1 = 'user1'
    const userId2 = 'user2'

    cacheService.cacheCharacters(userId1, mockCharacters)
    cacheService.cacheCharacters(userId2, mockCharacters)

    const expiredEntry = {
      data: mockCharacters,
      timestamp: DateTime.now().minus({ minutes: 10 }),
      ttl: 5 * 60,
    }
    cacheService['cache'].set(`user_characters:${userId1}`, expiredEntry)

    cacheService.cleanupExpired()

    const stats = cacheService.getStats()
    assert.equal(stats.totalEntries, 1, 'Should have 1 entry after cleanup')
    assert.equal(stats.validEntries, 1, 'Should have 1 valid entry')
    assert.equal(stats.expiredEntries, 0, 'Should have 0 expired entries')
  })

  test('should clear all cache entries', async ({ assert }) => {
    cacheService.cacheCharacters('user1', mockCharacters)
    cacheService.cacheCharacters('user2', mockCharacters)

    cacheService.clear()

    const stats = cacheService.getStats()
    assert.equal(stats.totalEntries, 0)
  })
})
