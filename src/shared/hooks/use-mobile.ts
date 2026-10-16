import { useCallback, useSyncExternalStore } from 'react'

const MOBILE_BREAKPOINT = 768
const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

function subscribe(onStoreChange: () => void): () => void {
  const matchMedia = window.matchMedia(MOBILE_QUERY)
  matchMedia.addEventListener('change', onStoreChange)
  return () => matchMedia.removeEventListener('change', onStoreChange)
}

export function useIsMobile(): boolean {
  const getSnapshot = useCallback(() => window.matchMedia(MOBILE_QUERY).matches, [])
  const getServerSnapshot = () => false

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
