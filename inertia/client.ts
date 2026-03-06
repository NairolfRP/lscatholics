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

export const currentRoute = () => client.current()

export const isCurrentRoute = (
  routeName: keyof typeof registry.routes,
  options?: {
    params?: Record<string, any>
    query?: Record<string, any>
  }
) => {
  const page = usePage()
  const current = page.props.currentRoute as keyof typeof registry.routes | undefined

  if (!current) return false

  if (routeName.endsWith('*')) {
    const routeWithoutAsterisk = routeName.replace('*', '')

    if (current === routeWithoutAsterisk) return true

    const prefix = registry.routes[routeWithoutAsterisk as keyof typeof registry.routes]?.pattern
    const currentPattern = registry.routes[current]?.pattern?.replace(/\/:[^/]+/g, '')

    if (!prefix || !currentPattern) return false

    return currentPattern.startsWith(prefix)
  }

  return client.current(routeName, options)
}

export const hasRoute = (routeName: string) => {
  return client.has(routeName as any)
}
