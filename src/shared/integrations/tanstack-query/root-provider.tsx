import { QueryClient } from '@tanstack/react-query'

const networkMode = import.meta.env.DEV ? 'always' : undefined

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        networkMode,
        staleTime: 60 * 1000,
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
