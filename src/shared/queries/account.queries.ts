import { queryOptions } from '@tanstack/react-query'
import { authClient } from '#shared/integrations/auth/auth-client.ts'

export const accountQueryOptions = (sessionId: string, providerId: string) =>
  queryOptions({
    queryKey: ['accounts', sessionId, providerId],
    queryFn: async () => {
      const { data, error } = await authClient.listAccounts()

      if (error) {
        throw new Error(error.message)
      }

      return data?.find((account) => account.providerId === providerId)
    },
  })
