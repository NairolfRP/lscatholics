import { queryOptions } from '@tanstack/react-query'
import type { useReauth } from '#/shared/hooks/auth/use-reauth'
import { authClient } from '#/shared/integrations/auth/auth-client'

const USER_SESSIONS_QUERY_KEY = 'active-sessions'

export const userlistSessionsQueryOptions = (
  withFreshSession: ReturnType<typeof useReauth>['withFreshSession'],
  currentSessionId?: string
) => {
  return queryOptions({
    queryKey: [USER_SESSIONS_QUERY_KEY, currentSessionId],
    queryFn: async () => {
      return withFreshSession(async () => {
        const { data, error: fetchError } = await authClient.listSessions()

        if (fetchError) {
          throw fetchError
        }

        return data
      })
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const userListSessionsQueryKey = (currentSessionId: string) => {
  return queryOptions({
    queryKey: [USER_SESSIONS_QUERY_KEY, currentSessionId],
  })
}
