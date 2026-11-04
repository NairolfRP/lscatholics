import { useCallback, useEffect, useRef, useState } from 'react'
import type { AnyFormApi } from '@tanstack/react-form'

const DRAFT_VERSION = 1
const DEFAULT_SAVE_DELAY_MS = 500

export interface StoredFormDraft {
  version: number
  values: unknown
  savedAt?: number
}

export interface UseFormLocalStorageOptions<TValues> {
  form: AnyFormApi
  storageKey: string
  saveDelayMs?: number
  serialize?: (values: TValues) => unknown
  deserialize?: (stored: unknown) => TValues
}

export interface FormLocalStorage {
  hasDraft: boolean
  restoreDraft: () => void
  discardDraft: () => void
  clearDraft: () => void
}

export function useFormLocalStorage<TValues>({
  form,
  storageKey,
  saveDelayMs = DEFAULT_SAVE_DELAY_MS,
  serialize,
  deserialize,
}: UseFormLocalStorageOptions<TValues>): FormLocalStorage {
  const [pendingValues, setPendingValues] = useState<TValues | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  const externallyDeletedValuesRef = useRef<string | null>(null)
  const optionsRef = useRef({ serialize, deserialize })
  useEffect(() => {
    optionsRef.current = { serialize, deserialize }
  }, [serialize, deserialize])

  useEffect(() => {
    let storedValues: TValues | null = null

    try {
      const raw = window.localStorage.getItem(storageKey)
      if (raw) {
        const stored = JSON.parse(raw) as Partial<StoredFormDraft>
        if (stored.version === DRAFT_VERSION) {
          const { deserialize: deserializeDraft = (values) => values as TValues } =
            optionsRef.current
          storedValues = deserializeDraft(stored.values)
        } else {
          window.localStorage.removeItem(storageKey)
        }
      }
    } catch {
      try {
        window.localStorage.removeItem(storageKey)
      } catch {
        // Storage can be unavailable (private mode, disabled cookies).
      }
    }

    // oxlint-disable-next-line react/set-state-in-effect
    setPendingValues(storedValues)
    // oxlint-disable-next-line react/set-state-in-effect
    setIsHydrated(true)
  }, [storageKey])

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== storageKey || event.newValue !== null) {
        return
      }

      // Another tab deleted this draft. Stop the open form from saving its
      // current values again, unless the user edits them afterwards.
      externallyDeletedValuesRef.current = JSON.stringify(form.state.values)
      setPendingValues(null)
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [form, storageKey])

  useEffect(() => {
    if (!isHydrated || pendingValues) return

    const save = () => {
      if (!form.state.isDirty) return

      const values = form.state.values as TValues
      const { serialize: serializeDraft } = optionsRef.current

      try {
        const currentValues = JSON.stringify(values)
        if (externallyDeletedValuesRef.current !== null) {
          if (externallyDeletedValuesRef.current === currentValues) return
          externallyDeletedValuesRef.current = null
        }

        window.localStorage.setItem(
          storageKey,
          JSON.stringify({
            version: DRAFT_VERSION,
            values: serializeDraft ? serializeDraft(values) : values,
            savedAt: Date.now(),
          } satisfies StoredFormDraft)
        )
      } catch {
        // Ignore quota errors and unavailable storage.
      }
    }

    let timeoutId: ReturnType<typeof setTimeout> | undefined

    const scheduleSave = () => {
      if (!form.state.isDirty || timeoutId) return
      timeoutId = setTimeout(() => {
        timeoutId = undefined
        save()
      }, saveDelayMs)
    }

    const flush = () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = undefined
      }
      save()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') flush()
    }

    const subscription = form.store.subscribe(scheduleSave)
    window.addEventListener('pagehide', flush)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('pagehide', flush)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      flush()
    }
  }, [form, isHydrated, pendingValues, saveDelayMs, storageKey])

  const restoreDraft = useCallback(() => {
    if (!pendingValues) return
    form.reset(pendingValues, { keepDefaultValues: true })
    setPendingValues(null)
  }, [form, pendingValues])

  const discardDraft = useCallback(() => {
    externallyDeletedValuesRef.current = null
    try {
      window.localStorage.removeItem(storageKey)
    } catch {
      // Storage can be unavailable (private mode, disabled cookies).
    }
    setPendingValues(null)
  }, [storageKey])

  const clearDraft = useCallback(() => {
    externallyDeletedValuesRef.current = null
    try {
      window.localStorage.removeItem(storageKey)
    } catch {
      // Storage can be unavailable (private mode, disabled cookies).
    }
  }, [storageKey])

  return {
    hasDraft: pendingValues !== null,
    restoreDraft,
    discardDraft,
    clearDraft,
  }
}
