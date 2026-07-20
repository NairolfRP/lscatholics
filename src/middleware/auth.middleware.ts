import { createMiddleware } from '@tanstack/react-start'
import { ensureSession, getSession } from '../server/services/auth.service'

export const requireAuthMiddleware = createMiddleware({ type: 'request' }).server(
  async ({ next }) => {
    const session = await ensureSession()

    return next({ context: { session } })
  }
)

export const silentAuthMiddleware = createMiddleware({ type: 'request' }).server(
  async ({ next }) => {
    const session = await getSession().catch(() => null)

    return next({ context: { session } })
  }
)
