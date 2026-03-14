import { createTuyau } from '@tuyau/core/client'
import { registry } from '@generated/registry'
import { QueryClient } from '@tanstack/react-query'
import { createTuyauReactQueryClient } from '@tuyau/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
})

export const client = createTuyau({
  baseUrl: import.meta.env.VITE_APP_URL || 'http://localhost:3333',
  registry,
  headers: { Accept: 'application/json' },
  credentials: 'include',
})
export const api = createTuyauReactQueryClient({ client })

export const urlFor = client.urlFor

export const currentRoute = () => client.current()

export const isCurrentRoute = (
  routeName: keyof typeof registry.routes,
  options?: {
    params?: Record<string, any>
    query?: Record<string, any>
  }
) => {
  return client.current(routeName, options)
}

export const hasRoute = (routeName: string) => {
  return client.has(routeName as any)
}
