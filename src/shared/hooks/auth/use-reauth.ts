import { useReauthContext } from '#/shared/providers/require-reauth-provider'

export function isSessionNotFresh(error: unknown): boolean {
  if (!error || typeof error !== 'object' || !('code' in error) || !('status' in error))
    return false
  return error.code === 'SESSION_NOT_FRESH' && error.status === 403
}

export function useReauth() {
  const { requireFreshSession } = useReauthContext()

  const withFreshSession = async <T>(fn: () => Promise<T>): Promise<T> => {
    try {
      return await fn()
    } catch (error) {
      if (isSessionNotFresh(error)) {
        await requireFreshSession()
        return fn()
      }
      throw error
    }
  }

  return { withFreshSession }
}
