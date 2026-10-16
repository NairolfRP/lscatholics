import { useCallback, useSyncExternalStore } from 'react'

interface UseMediaQueryOptions {
  defaultValue?: boolean
  initializeWithValue?: boolean
}

function subscribe(query: string, onStoreChange: () => void): () => void {
  const matchMedia = window.matchMedia(query)
  matchMedia.addEventListener('change', onStoreChange)
  return () => matchMedia.removeEventListener('change', onStoreChange)
}

export function useMediaQuery(
  query: string,
  { defaultValue = false }: UseMediaQueryOptions = {}
): boolean {
  const subscribeToQuery = useCallback(
    (onStoreChange: () => void) => subscribe(query, onStoreChange),
    [query]
  )
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query])
  const getServerSnapshot = useCallback(() => defaultValue, [defaultValue])

  return useSyncExternalStore(subscribeToQuery, getSnapshot, getServerSnapshot)
}
