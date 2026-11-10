import { useRouter } from '@tanstack/react-router'
import type { RoutePath } from '#/shared/types/route.types'
import { withFreshSession } from '#/shared/utils/reauth'
import { isReauthCancelled } from '#/shared/utils/reauth-error'

export function useReauth(cancelCallbackURL: RoutePath = '/account/settings') {
  const router = useRouter()

  return {
    withFreshSession: async <T>(fn: () => Promise<T>): Promise<T> => {
      try {
        return await withFreshSession(fn)
      } catch (error) {
        if (isReauthCancelled(error)) {
          void router.navigate({ to: cancelCallbackURL, replace: true })
        }

        throw error
      }
    },
  }
}
