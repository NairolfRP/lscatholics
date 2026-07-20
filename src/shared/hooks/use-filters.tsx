import type { RegisteredRouter, RouteIds } from '@tanstack/react-router'
import { useNavigate, useSearch } from '@tanstack/react-router'

export function useFilters<T extends RouteIds<RegisteredRouter['routeTree']>>(routeId: T) {
  const navigate = useNavigate()
  const filters = useSearch({ from: routeId })

  const setFilters = (partialFilters: Partial<typeof filters>) =>
    navigate({
      to: '.',
      search: (prev) => ({ ...prev, ...partialFilters }),
      reloadDocument: false,
      resetScroll: false,
    })
  const resetFilters = () => navigate({ to: '.', search: {} })

  return { filters, setFilters, resetFilters }
}
