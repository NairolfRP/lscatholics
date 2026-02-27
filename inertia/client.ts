import { createTuyau } from '@tuyau/core/client'
import { registry } from '@generated/registry'
import { usePage } from '@inertiajs/vue3'

export const client = createTuyau({
  baseUrl: import.meta.env.VITE_APP_URL || 'http://localhost:3333',
  registry,
  headers: { Accept: 'application/json' },
  credentials: 'include',
})

export const urlFor = client.urlFor

/**
 * Temporary utilities - waiting for the ‘has’ and ‘current’ properties to be added back to Tuyau
 */
export const hasRoute = (route: string) => {
  try {
    return route in registry.routes
  } catch {
    return false
  }
}
export const isCurrentRoute = (routeName: string) => {
  const page = usePage()
  const current = page.props.currentRoute as string | undefined

  if (!current) return false

  if (routeName.endsWith('*')) {
    const prefix = routeName.replace('*', '')
    return current.startsWith(prefix)
  }

  return current === routeName
}
