import { QueryClient } from '@tanstack/react-query'

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        retry: 3,
        refetchOnWindowFocus: false,
      },
    },
  })
}

export const queryClient = createQueryClient()
