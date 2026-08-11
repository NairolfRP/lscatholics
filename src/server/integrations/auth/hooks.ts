import { APIError, createAuthMiddleware, getSessionFromCtx } from 'better-auth/api'
import { and, eq } from 'drizzle-orm'
import { db } from '#server/db'
import * as authSchema from '#server/db/schema/auth-schema'
import { ERROR_CODES, GTAW_PROVIDER_ID } from './auth.constants'

type HookContext = Parameters<Parameters<typeof createAuthMiddleware>[0]>[0]

function enforceGTAWSignIn(ctx: HookContext) {
  if (ctx.body?.provider !== GTAW_PROVIDER_ID) {
    throw APIError.from('FORBIDDEN', {
      code: ERROR_CODES.FORBIDDEN_SIGN_IN_PROVIDER,
      message: 'Only GTA World sign-in is allowed',
    })
  }
}

async function protectGTAWAccountUnlink(ctx: HookContext) {
  const session = await getSessionFromCtx(ctx)
  if (!session?.session) {
    throw APIError.from('UNAUTHORIZED', {
      code: ERROR_CODES.UNAUTHORIZED,
      message: 'Unauthorized',
    })
  }

  const { accountId } = ctx.body
  const accounts = await ctx.context.internalAdapter.findAccounts(session.user.id)

  const isGTAWAccount = accounts.find(
    (account) => account.id === accountId && account.providerId === GTAW_PROVIDER_ID
  )

  if (isGTAWAccount) {
    throw APIError.from('FORBIDDEN', {
      code: ERROR_CODES.CANT_UNLINK_GTAW_ACCOUNT,
      message: 'Cannot unlink GTA World account - this is your primary authentication method',
    })
  }
}

export async function enforceOneAccountPerProvider(accountData: {
  userId: string
  providerId: string
}) {
  const nbOfProviderAccounts = await db.$count(
    authSchema.accounts,
    and(
      eq(authSchema.accounts.userId, accountData.userId),
      eq(authSchema.accounts.providerId, accountData.providerId)
    )
  )

  if (nbOfProviderAccounts > 0) {
    throw APIError.from('FORBIDDEN', {
      code: ERROR_CODES.ONE_ACCOUNT_PER_SOCIAL_PROVIDER,
      message: 'User can only have one account per provider',
    })
  }

  return { data: accountData }
}

export const beforeHook = createAuthMiddleware(async (ctx) => {
  if (ctx.path === '/sign-in/social') {
    enforceGTAWSignIn(ctx)
  }

  if (ctx.path === '/unlink-account') {
    await protectGTAWAccountUnlink(ctx)
  }
})
