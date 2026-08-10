import type { TestHelpers } from 'better-auth/plugins'
import { eq } from 'drizzle-orm'
import { beforeAll, describe, expect, it } from 'vitest'
import { db } from '#server/db'
import { accounts } from '#server/db/schema/auth-schema'
import { auth } from '#server/integrations/auth.server'

let test: TestHelpers

function trustedHeaders() {
  return new Headers({ origin: 'http://localhost:3000' })
}

function errorCode(error: unknown): string | undefined {
  if (typeof error !== 'object' || error === null) return undefined
  const err = error as { code?: string; body?: { code?: string } }
  return err.code ?? err.body?.code
}

async function createUser(overrides: Record<string, unknown> = {}) {
  return test.saveUser(test.createUser({ role: 'user', banned: false, ...overrides }))
}

async function createAccount(
  userId: string,
  providerId: string,
  accountId: string,
  issuer = providerId
) {
  const [account] = await db
    .insert(accounts)
    .values({ id: crypto.randomUUID(), userId, providerId, accountId, issuer })
    .returning()

  return account
}

async function login(userId: string) {
  return test.login({ userId })
}

async function captureError<T>(promise: Promise<T>): Promise<{ error: unknown; result: T }> {
  try {
    return { error: undefined, result: await promise }
  } catch (error) {
    return { error, result: undefined as T }
  }
}

beforeAll(async () => {
  const ctx = (await auth.$context) as unknown as { test: TestHelpers }
  test = ctx.test
})

describe('hook /sign-in/social - only GTA World sign-in is allowed', () => {
  it('rejects sign-in with a non-gtaw provider', async () => {
    const { error } = await captureError(
      auth.api.signInSocial({
        body: { provider: 'discord', callbackURL: 'http://localhost:3000/' },
        headers: trustedHeaders(),
      })
    )

    expect(error).toBeDefined()
    expect(errorCode(error)).toBe('FORBIDDEN_SIGN_IN_PROVIDER')
  })

  it('allows sign-in with the gtaw provider', async () => {
    const { error, result } = await captureError(
      auth.api.signInSocial({
        body: {
          provider: 'gtaw',
          callbackURL: 'http://localhost:3000/',
          disableRedirect: true,
        },
        headers: trustedHeaders(),
      })
    )

    expect(error).toBeUndefined()
    expect(result.redirect).toBe(false)
    expect(result.url).toBeTruthy()
  })
})

describe('hook /unlink-account - GTA World account is protected', () => {
  it('rejects unlink when unauthenticated', async () => {
    const { error } = await captureError(
      auth.api.unlinkAccount({
        body: { accountId: 'does-not-matter' },
        headers: trustedHeaders(),
      })
    )

    expect(error).toBeDefined()
    expect(errorCode(error)).toBe('UNAUTHORIZED')
  })

  it('rejects unlinking the gtaw account', async () => {
    const user = await createUser()
    const gtawAccount = await createAccount(user.id, 'gtaw', 'gtaw-account-1')
    await createAccount(user.id, 'discord', 'discord-account-1')
    const { headers } = await login(user.id)

    const { error } = await captureError(
      auth.api.unlinkAccount({ body: { accountId: gtawAccount.id }, headers })
    )

    expect(error).toBeDefined()
    expect(errorCode(error)).toBe('CANT_UNLINK_GTAW_ACCOUNT')

    await test.deleteUser(user.id)
  })

  it('allows unlinking a non-gtaw account', async () => {
    const user = await createUser()
    await createAccount(user.id, 'gtaw', 'gtaw-account-1')
    const discordAccount = await createAccount(user.id, 'discord', 'discord-account-1')
    const { headers } = await login(user.id)

    const { error, result } = await captureError(
      auth.api.unlinkAccount({ body: { accountId: discordAccount.id }, headers })
    )

    expect(error).toBeUndefined()
    expect(result.status).toBe(true)

    const remaining = await db.select().from(accounts).where(eq(accounts.id, discordAccount.id))
    expect(remaining).toHaveLength(0)

    await test.deleteUser(user.id)
  })
})

describe('database hook account.create.before - one account per provider', () => {
  let ctx: {
    internalAdapter: {
      createAccount: (data: {
        userId: string
        providerId: string
        accountId: string
        issuer: string
      }) => Promise<unknown>
    }
  }

  beforeAll(async () => {
    ctx = await auth.$context
  })

  it('allows creating the first account for a provider', async () => {
    const user = await createUser()

    const account = await ctx.internalAdapter.createAccount({
      userId: user.id,
      providerId: 'discord',
      accountId: 'discord-account-1',
      issuer: 'discord',
    })

    expect(account).toBeDefined()

    await test.deleteUser(user.id)
  })

  it('allows linking a different provider for the same user', async () => {
    const user = await createUser()
    await createAccount(user.id, 'discord', 'discord-account-1')

    const account = await ctx.internalAdapter.createAccount({
      userId: user.id,
      providerId: 'gtaw',
      accountId: 'gtaw-account-1',
      issuer: 'gtaw',
    })

    expect(account).toBeDefined()

    await test.deleteUser(user.id)
  })

  it('rejects creating a second account for the same provider', async () => {
    const user = await createUser()
    await createAccount(user.id, 'discord', 'discord-account-1')

    const { error } = await captureError(
      ctx.internalAdapter.createAccount({
        userId: user.id,
        providerId: 'discord',
        accountId: 'discord-account-2',
        issuer: 'discord',
      })
    )

    expect(error).toBeDefined()
    expect(errorCode(error)).toBe('ONE_ACCOUNT_PER_SOCIAL_PROVIDER')

    await test.deleteUser(user.id)
  })
})
