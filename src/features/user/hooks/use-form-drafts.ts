import { useCallback, useEffect, useState } from 'react'
import { FORM_DRAFTS } from '#shared/constants/form-drafts.ts'
import type { StoredFormDraft } from '#shared/hooks/use-form-local-storage.ts'

export interface FormDraftSummary {
  storageKey: string
  label: string
  savedAt?: number
}

function removeDraft(storageKey: string) {
  try {
    window.localStorage.removeItem(storageKey)
  } catch {
    // Storage can be unavailable (private mode, disabled cookies).
  }
}

function readFormDrafts(): FormDraftSummary[] {
  return FORM_DRAFTS.flatMap(({ storageKey, label }) => {
    const raw = window.localStorage.getItem(storageKey)
    if (raw === null) {
      return []
    }

    let savedAt: number | undefined
    try {
      const { savedAt: storedSavedAt } = JSON.parse(raw) as Partial<StoredFormDraft>
      if (typeof storedSavedAt === 'number' && Number.isFinite(storedSavedAt)) {
        savedAt = storedSavedAt
      }
    } catch {
      // Malformed drafts can still be listed and deleted.
    }

    return [{ storageKey, label, savedAt }]
  })
}

export function useFormDrafts() {
  const [drafts, setDrafts] = useState<FormDraftSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(() => {
    try {
      setDrafts(readFormDrafts())
    } catch {
      setDrafts([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // Drafts only exist in the browser, so hydrate them once mounted.
    // oxlint-disable-next-line react/set-state-in-effect
    refresh()
    window.addEventListener('storage', refresh)
    return () => window.removeEventListener('storage', refresh)
  }, [refresh])

  const deleteDraft = useCallback((storageKey: string) => {
    removeDraft(storageKey)
    setDrafts((current) => current.filter((draft) => draft.storageKey !== storageKey))
  }, [])

  const clearDrafts = useCallback(() => {
    for (const { storageKey } of FORM_DRAFTS) {
      removeDraft(storageKey)
    }
    setDrafts([])
  }, [])

  return { drafts, isLoading, deleteDraft, clearDrafts }
}
