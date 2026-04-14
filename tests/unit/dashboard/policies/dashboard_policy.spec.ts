import { test } from '@japa/runner'
import sinon from 'sinon'
import DashboardPolicy from '#dashboard/policies/dashboard_policy'
import factionConfig from '#config/faction'

function makeCtx(
  overrides: {
    currentCharacter?: { id: number } | null
    characterHasMinRank?: boolean | Error
  } = {}
) {
  const { currentCharacter = { id: 1 }, characterHasMinRank = true } = overrides

  const hasMinRankStub =
    characterHasMinRank instanceof Error
      ? sinon.stub().rejects(characterHasMinRank)
      : sinon.stub().resolves(characterHasMinRank)

  return {
    logger: { error: sinon.stub() },
    characters: {
      getCurrentCharacter: sinon.stub().resolves(currentCharacter),
    },
    factions: {
      characterHasMinRank: hasMinRankStub,
    },
  } as any
}

const MOCK_USER = { id: 41 } as any

test.group('DashboardPolicy', () => {
  test('access() returns false when no current character', async ({ assert }) => {
    const policy = new DashboardPolicy()
    const ctx = makeCtx({ currentCharacter: null })

    const result = await policy.access(MOCK_USER, ctx)

    assert.isFalse(result)
    sinon.assert.notCalled(ctx.factions.characterHasMinRank)
  })

  test('access() returns true when character meets minimum rank', async ({ assert }) => {
    const policy = new DashboardPolicy()
    const ctx = makeCtx({ characterHasMinRank: true })

    const result = await policy.access(MOCK_USER, ctx)

    assert.isTrue(result)
    sinon.assert.calledOnceWithExactly(
      ctx.factions.characterHasMinRank,
      1,
      factionConfig.factionId,
      factionConfig.minimalRankDashboardAccess
    )
  })

  test('access() returns false when character rank is insufficient', async ({ assert }) => {
    const policy = new DashboardPolicy()
    const ctx = makeCtx({ characterHasMinRank: false })

    const result = await policy.access(MOCK_USER, ctx)

    assert.isFalse(result)
  })

  test('access() returns false and logs error when factionService throws', async ({ assert }) => {
    const policy = new DashboardPolicy()
    const ctx = makeCtx({ characterHasMinRank: new Error('Failed to fetch factions: 500') })

    const result = await policy.access(MOCK_USER, ctx)

    assert.isFalse(result)
    sinon.assert.calledOnce(ctx.logger.error)
  })

  test('access() passes correct factionId and minRank from config', async ({ assert }) => {
    const policy = new DashboardPolicy()
    const ctx = makeCtx({ characterHasMinRank: true })

    await policy.access(MOCK_USER, ctx)

    const [characterId, factionId, minRank] = ctx.factions.characterHasMinRank.firstCall.args

    assert.equal(characterId, 1)
    assert.equal(factionId, factionConfig.factionId)
    assert.equal(minRank, factionConfig.minimalRankDashboardAccess)
  })
})
