import type { ComponentPropsWithRef } from 'react'
import { useFormContext } from '#/shared/integrations/form/form-hook'
import { Button } from '../ui/button'
import { Spinner } from '../ui/spinner'

type SubmitButtonProps = ComponentPropsWithRef<typeof Button> & {
  label: string
  submittingLabel?: string
}

export function SubmitButton({ label, submittingLabel, disabled, ...props }: SubmitButtonProps) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <Button
          type="submit"
          disabled={typeof disabled === 'boolean' ? disabled && !canSubmit : !canSubmit}
          {...props}
        >
          {submittingLabel && isSubmitting ? <SubmittingLabel label={submittingLabel} /> : label}
        </Button>
      )}
    </form.Subscribe>
  )
}

function SubmittingLabel({ label }: { label: string }) {
  return (
    <>
      <Spinner className="mr-2 size-5" /> {label}
    </>
  )
}
