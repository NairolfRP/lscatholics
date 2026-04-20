import { test } from '@japa/runner'
import nock from 'nock'
import sinon from 'sinon'
import { FactionService } from '#characters/services/faction_service'
import { FactionCacheService } from '#characters/services/faction_cache_service'
import app from '@adonisjs/core/services/app'

const GTAW_BASE_URL = 'https://ucp-fr.gta.world'
const GTAW_FACTIONS_PATH = '/api/factions'

const MOCK_API_RESPONSE = {
  requestId: 'abc-123',
  data: {
    '1': {
      faction: 563,
      faction_name: 'LSPD',
      faction_rank: 12,
      faction_rank_name: 'Lieutenant',
    },
    '2': {
      faction: 563,
      faction_name: 'LSPD',
      faction_rank: 5,
      faction_rank_name: 'Officer',
    },
  },
}

function makeCtx(overrides: Record<string, any> = {}) {
  const logger = { error: sinon.stub(), warn: sinon.stub(), info: sinon.stub() }

  const account = {
    providerId: 'gtaw',
    getDecryptedAccessToken: () => 'mock-token',
  }

  const user = {
    id: 41,
    accounts: [account],
    loadOnce: sinon.stub().resolves(),
  }

  return {
    logger,
    auth: {
      user,
      use: () => ({ logout: sinon.stub().resolves() }),
    },
    characters: {
      getCurrentCharacter: sinon.stub().resolves({ id: 1 }),
    },
    factions: null as any,
    ...overrides,
  } as any
}

function makeService(ctx: any) {
  return new FactionService(ctx)
}

test.group('FactionService', (group) => {
  let cacheService: FactionCacheService

  group.setup(() => {
    if (!nock.isActive()) nock.activate()
  })

  group.teardown(() => {
    nock.restore()
  })

  group.each.setup(() => {
    cacheService = new FactionCacheService()
    sinon.stub(app.container, 'make').resolves(cacheService)
  })

  group.each.teardown(() => {
    nock.cleanAll()
    sinon.restore()
    cacheService.clear()
    cacheService.stopCleanupInterval()
  })

  // -------------------------
  // #fetchFactionsFromAPI
  // -------------------------

  test('getAllUserFactions() fetches and remaps API response correctly', async ({ assert }) => {
    nock(GTAW_BASE_URL).get(GTAW_FACTIONS_PATH).reply(200, MOCK_API_RESPONSE)

    const ctx = makeCtx()
    const service = makeService(ctx)

    const result = await service.getAllUserFactions()

    assert.lengthOf(result, 2)
    assert.equal(result[0].characterId, 1)
    assert.equal(result[0].factionId, 563)
    assert.equal(result[0].factionRank, 12)
    assert.equal(result[1].characterId, 2)
    assert.equal(result[1].factionRank, 5)
  })

  test('getAllUserFactions() throws when API returns 500', async ({ assert }) => {
    nock(GTAW_BASE_URL).get(GTAW_FACTIONS_PATH).reply(500, 'Internal Server Error').persist()

    const ctx = makeCtx()
    const service = makeService(ctx)

    await assert.rejects(() => service.getAllUserFactions(), /Failed to fetch factions: 500/)
  }).timeout(10000)

  test('getAllUserFactions() throws when no authenticated user', async ({ assert }) => {
    const ctx = makeCtx({ auth: { user: null } })
    const service = makeService(ctx)

    await assert.rejects(() => service.getAllUserFactions(), /No authenticated user found/)
  })

  test('getAllUserFactions() logs out and throws when no GTAW account', async ({ assert }) => {
    const logoutStub = sinon.stub().resolves()
    const ctx = makeCtx({
      auth: {
        user: {
          id: 41,
          accounts: [{ providerId: 'other', getDecryptedAccessToken: () => 'token' }],
          loadOnce: sinon.stub().resolves(),
        },
        use: () => ({ logout: logoutStub }),
      },
    })
    const service = makeService(ctx)

    await assert.rejects(() => service.getAllUserFactions(), /No GTAW account found/)
    sinon.assert.calledOnce(logoutStub)
  })

  test('getAllUserFactions() logs out and throws when no access token', async ({ assert }) => {
    const logoutStub = sinon.stub().resolves()
    const ctx = makeCtx({
      auth: {
        user: {
          id: 41,
          accounts: [{ providerId: 'gtaw', getDecryptedAccessToken: () => null }],
          loadOnce: sinon.stub().resolves(),
        },
        use: () => ({ logout: logoutStub }),
      },
    })
    const service = makeService(ctx)

    await assert.rejects(() => service.getAllUserFactions(), /No access token available/)
    sinon.assert.calledOnce(logoutStub)
  })

  test('getAllUserFactions() uses cache on second call', async ({ assert }) => {
    const scope = nock(GTAW_BASE_URL).get(GTAW_FACTIONS_PATH).once().reply(200, MOCK_API_RESPONSE)

    const ctx = makeCtx()
    const service = makeService(ctx)

    await service.getAllUserFactions()
    await service.getAllUserFactions()

    assert.isTrue(scope.isDone())
    assert.isFalse(nock.pendingMocks().length > 0)
  })

  test('getAllUserFactions(forceRefresh=true) bypasses cache', async ({ assert }) => {
    nock(GTAW_BASE_URL).get(GTAW_FACTIONS_PATH).twice().reply(200, MOCK_API_RESPONSE)

    const ctx = makeCtx()
    const service = makeService(ctx)

    await service.getAllUserFactions()
    await service.getAllUserFactions(true)

    assert.isFalse(nock.isDone() === false)
  })

  // -------------------------
  // getCharacterFactions
  // -------------------------

  test('getCharacterFactions() returns faction for existing character', async ({ assert }) => {
    nock(GTAW_BASE_URL).get(GTAW_FACTIONS_PATH).reply(200, MOCK_API_RESPONSE)

    const ctx = makeCtx()
    const service = makeService(ctx)

    const result = await service.getCharacterFactions(1)

    assert.isNotNull(result)
    assert.equal(result?.characterId, 1)
    assert.equal(result?.factionRank, 12)
  })

  test('getCharacterFactions() returns null for unknown character', async ({ assert }) => {
    nock(GTAW_BASE_URL).get(GTAW_FACTIONS_PATH).reply(200, MOCK_API_RESPONSE)

    const ctx = makeCtx()
    const service = makeService(ctx)

    const result = await service.getCharacterFactions(999)

    assert.isNull(result)
  })

  // -------------------------
  // characterHasFaction
  // -------------------------

  test('characterHasFaction() returns true when character is in faction', async ({ assert }) => {
    nock(GTAW_BASE_URL).get(GTAW_FACTIONS_PATH).reply(200, MOCK_API_RESPONSE)

    const ctx = makeCtx()
    const service = makeService(ctx)

    const result = await service.characterHasFaction(1, 563)

    assert.isTrue(result)
  })

  test('characterHasFaction() returns false for wrong faction', async ({ assert }) => {
    nock(GTAW_BASE_URL).get(GTAW_FACTIONS_PATH).reply(200, MOCK_API_RESPONSE)

    const ctx = makeCtx()
    const service = makeService(ctx)

    const result = await service.characterHasFaction(1, 999)

    assert.isFalse(result)
  })

  // -------------------------
  // characterHasMinRank
  // -------------------------

  test('characterHasMinRank() returns true when rank is sufficient', async ({ assert }) => {
    nock(GTAW_BASE_URL).get(GTAW_FACTIONS_PATH).reply(200, MOCK_API_RESPONSE)

    const ctx = makeCtx()
    const service = makeService(ctx)

    const result = await service.characterHasMinRank(1, 563, 9)

    assert.isTrue(result)
  })

  test('characterHasMinRank() returns true at exact minimum rank', async ({ assert }) => {
    nock(GTAW_BASE_URL).get(GTAW_FACTIONS_PATH).reply(200, MOCK_API_RESPONSE)

    const ctx = makeCtx()
    const service = makeService(ctx)

    const result = await service.characterHasMinRank(1, 563, 12)

    assert.isTrue(result)
  })

  test('characterHasMinRank() returns false when rank is insufficient', async ({ assert }) => {
    nock(GTAW_BASE_URL).get(GTAW_FACTIONS_PATH).reply(200, MOCK_API_RESPONSE)

    const ctx = makeCtx()
    const service = makeService(ctx)

    const result = await service.characterHasMinRank(2, 563, 9)

    assert.isFalse(result)
  })

  test('characterHasMinRank() returns false for wrong faction', async ({ assert }) => {
    nock(GTAW_BASE_URL).get(GTAW_FACTIONS_PATH).reply(200, MOCK_API_RESPONSE)

    const ctx = makeCtx()
    const service = makeService(ctx)

    const result = await service.characterHasMinRank(1, 999, 1)

    assert.isFalse(result)
  })

  test('characterHasMinRank() returns false for unknown character', async ({ assert }) => {
    nock(GTAW_BASE_URL).get(GTAW_FACTIONS_PATH).reply(200, MOCK_API_RESPONSE)

    const ctx = makeCtx()
    const service = makeService(ctx)

    const result = await service.characterHasMinRank(999, 563, 1)

    assert.isFalse(result)
  })

  test('characterHasMinRank() throws when API fails', async ({ assert }) => {
    nock(GTAW_BASE_URL).get(GTAW_FACTIONS_PATH).reply(500)

    const ctx = makeCtx()
    const service = makeService(ctx)

    await assert.rejects(() => service.characterHasMinRank(1, 563, 9))
  })

  // -------------------------
  // getCharacterRank
  // -------------------------

  test('getCharacterRank() returns rank info for existing character', async ({ assert }) => {
    nock(GTAW_BASE_URL).get(GTAW_FACTIONS_PATH).reply(200, MOCK_API_RESPONSE)

    const ctx = makeCtx()
    const service = makeService(ctx)

    const result = await service.getCharacterRank(1)

    assert.isNotNull(result)
    assert.equal(result?.rank, 12)
    assert.equal(result?.rankName, 'Lieutenant')
  })

  test('getCharacterRank() returns null for unknown character', async ({ assert }) => {
    nock(GTAW_BASE_URL).get(GTAW_FACTIONS_PATH).reply(200, MOCK_API_RESPONSE)

    const ctx = makeCtx()
    const service = makeService(ctx)

    const result = await service.getCharacterRank(999)

    assert.isNull(result)
  })
})
