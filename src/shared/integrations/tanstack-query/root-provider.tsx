import { QueryClient } from '@tanstack/react-query'
import { isFiveMNui } from '#/utils/fivem-client.ts'

const networkMode = import.meta.env.DEV ? 'always' : undefined

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        networkMode,
        staleTime: 60 * 1000,
        retry: isFiveMNui ? 1 : undefined,
        refetchOnWindowFocus: isFiveMNui ? false : undefined,
        refetchOnReconnect: isFiveMNui ? false : undefined,
      },
      mutations: {
        networkMode,
      },
    },
  })

  return {
    queryClient,
  }
}
export default function TanstackQueryProvider() {}
