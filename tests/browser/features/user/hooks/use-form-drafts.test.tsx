import { afterEach, describe, expect, it } from 'vitest'
import { renderHook } from 'vitest-browser-react'
import { useFormDrafts } from '#/features/user/hooks/use-form-drafts.ts'
import {
  CLERGY_APPLICATION_DRAFT_STORAGE_KEY,
  INCIDENT_REPORT_DRAFT_STORAGE_KEY,
  JOB_APPLICATION_DRAFT_STORAGE_KEY,
} from '#shared/constants/form-drafts.ts'

afterEach(() => {
  window.localStorage.clear()
})

describe('useFormDrafts', () => {
  it('lists stored drafts with their save date', async () => {
    window.localStorage.setItem(
      INCIDENT_REPORT_DRAFT_STORAGE_KEY,
      JSON.stringify({ version: 1, values: {}, savedAt: 1_700_000_000_000 })
    )
    window.localStorage.setItem(
      JOB_APPLICATION_DRAFT_STORAGE_KEY,
      JSON.stringify({ version: 1, values: {} })
    )

    const { result } = await renderHook(() => useFormDrafts())

    expect(result.current.drafts).toEqual([
      {
        storageKey: INCIDENT_REPORT_DRAFT_STORAGE_KEY,
        label: 'Rapport d’incident',
        savedAt: 1_700_000_000_000,
      },
      {
        storageKey: JOB_APPLICATION_DRAFT_STORAGE_KEY,
        label: 'Candidature (emploi ou spontanée)',
        savedAt: undefined,
      },
    ])
  })

  it('deletes a single draft without touching the others', async () => {
    window.localStorage.setItem(INCIDENT_REPORT_DRAFT_STORAGE_KEY, '{}')
    window.localStorage.setItem(JOB_APPLICATION_DRAFT_STORAGE_KEY, '{}')
    window.localStorage.setItem('unrelated-storage-key', 'keep-me')

    const { result, act } = await renderHook(() => useFormDrafts())

    await act(() => result.current.deleteDraft(INCIDENT_REPORT_DRAFT_STORAGE_KEY))

    expect(window.localStorage.getItem(INCIDENT_REPORT_DRAFT_STORAGE_KEY)).toBeNull()
    expect(window.localStorage.getItem(JOB_APPLICATION_DRAFT_STORAGE_KEY)).toBe('{}')
    expect(window.localStorage.getItem('unrelated-storage-key')).toBe('keep-me')
    expect(result.current.drafts.map((draft) => draft.storageKey)).toEqual([
      JOB_APPLICATION_DRAFT_STORAGE_KEY,
    ])
  })

  it('clears every form draft without touching unrelated storage', async () => {
    window.localStorage.setItem(INCIDENT_REPORT_DRAFT_STORAGE_KEY, '{}')
    window.localStorage.setItem(JOB_APPLICATION_DRAFT_STORAGE_KEY, '{}')
    window.localStorage.setItem(CLERGY_APPLICATION_DRAFT_STORAGE_KEY, '{}')
    window.localStorage.setItem('unrelated-storage-key', 'keep-me')

    const { result, act } = await renderHook(() => useFormDrafts())

    await act(() => result.current.clearDrafts())

    expect(window.localStorage.getItem(INCIDENT_REPORT_DRAFT_STORAGE_KEY)).toBeNull()
    expect(window.localStorage.getItem(JOB_APPLICATION_DRAFT_STORAGE_KEY)).toBeNull()
    expect(window.localStorage.getItem(CLERGY_APPLICATION_DRAFT_STORAGE_KEY)).toBeNull()
    expect(window.localStorage.getItem('unrelated-storage-key')).toBe('keep-me')
    expect(result.current.drafts).toEqual([])
  })
})
