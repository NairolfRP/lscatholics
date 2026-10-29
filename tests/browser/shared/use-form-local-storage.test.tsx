import type { AnyFormApi } from '@tanstack/react-form'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderHook } from 'vitest-browser-react'
import { useFormLocalStorage } from '#shared/hooks/use-form-local-storage.ts'

const STORAGE_KEY = 'test-form-draft'

function createForm<TValues>(values: TValues) {
  const listeners = new Set<() => void>()

  const form = {
    state: { values, isDirty: true },
    store: {
      subscribe(listener: () => void) {
        listeners.add(listener)
        return { unsubscribe: () => listeners.delete(listener) }
      },
    },
    reset(nextValues: TValues) {
      form.state.values = nextValues
    },
    emit() {
      listeners.forEach((listener) => listener())
    },
  }

  return form
}

function renderFormDraft<TValues>(form: ReturnType<typeof createForm<TValues>>) {
  return renderHook(() =>
    useFormLocalStorage<TValues>({
      form: form as unknown as AnyFormApi,
      storageKey: STORAGE_KEY,
      saveDelayMs: 10,
    })
  )
}

afterEach(() => {
  window.localStorage.clear()
})

describe('useFormLocalStorage', () => {
  it('saves the form values in local storage while the form is dirty', async () => {
    const form = createForm({ name: '' })
    const { act } = await renderFormDraft(form)

    await act(() => {
      form.state.values = { name: 'Jean Valjean' }
      form.emit()
    })

    await vi.waitFor(() => {
      expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '')).toEqual({
        version: 1,
        values: { name: 'Jean Valjean' },
      })
    })
  })

  it('asks to restore an existing draft and restores it', async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 1, values: { name: 'Cosette' } })
    )

    const form = createForm({ name: '' })
    const { result, act } = await renderFormDraft(form)

    expect(result.current.hasDraft).toBe(true)

    await act(() => result.current.restoreDraft())

    expect(form.state.values).toEqual({ name: 'Cosette' })
    expect(result.current.hasDraft).toBe(false)
  })

  it('clears the draft when the user refuses to restore it', async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 1, values: { name: 'Marius' } })
    )

    const form = createForm({ name: '' })
    const { result, act } = await renderFormDraft(form)

    await act(() => result.current.discardDraft())

    expect(result.current.hasDraft).toBe(false)
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('ignores drafts from an unsupported version', async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 0, values: { name: 'Old' } })
    )

    const form = createForm({ name: '' })
    const { result } = await renderFormDraft(form)

    expect(result.current.hasDraft).toBe(false)
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})
