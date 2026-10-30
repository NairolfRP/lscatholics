import { useForm } from '@tanstack/react-form'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { useFormLocalStorage } from '#shared/hooks/use-form-local-storage.ts'

const STORAGE_KEY = 'nested-values-form-draft'

type Values = { step: { name: string } }

afterEach(() => {
  window.localStorage.clear()
})

function Harness() {
  const form = useForm({ defaultValues: { step: { name: '' } } })
  const draft = useFormLocalStorage<Values>({
    form,
    storageKey: STORAGE_KEY,
    saveDelayMs: 10,
  })

  return (
    <div>
      <form.FormGroup name="step">
        {() => (
          <form.Field name="step.name">
            {(field) => (
              <input
                aria-label="name"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>
        )}
      </form.FormGroup>
      <form.Subscribe selector={(state) => state.values.step.name}>
        {(name) => <output data-testid="value">{name}</output>}
      </form.Subscribe>
      <button type="button" onClick={draft.restoreDraft}>
        restore
      </button>
    </div>
  )
}

describe('useFormLocalStorage with nested values', () => {
  it('restores and saves nested group values', async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 1, values: { step: { name: 'Restored' } } })
    )

    const screen = await render(<Harness />)

    await screen.getByText('restore').click()
    expect(screen.getByTestId('value').element().textContent).toBe('Restored')

    await screen.getByLabelText('name').fill('Edited')

    await vi.waitFor(() => {
      expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '')).toEqual({
        version: 1,
        values: { step: { name: 'Edited' } },
      })
    })
  })
})
