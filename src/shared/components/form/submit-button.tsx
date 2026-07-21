import type { ComponentPropsWithRef } from 'react'
import type { AnyFormApi } from '@tanstack/react-form'
import { useFormContext } from '#/shared/integrations/form/form-hook'
import { Button } from '../ui/button'
import { Spinner } from '../ui/spinner'

type FormState<TFormValues> = Omit<AnyFormApi['state'], 'values'> & {
  values: TFormValues
}

type SubmitButtonProps<TFormValues = unknown> = Omit<
  ComponentPropsWithRef<typeof Button>,
  'disabled'
> & {
  label: string
  submittingLabel?: string
  disabled?: boolean | ((state: FormState<TFormValues>) => boolean)
}

const defaultDisabled = (state: AnyFormApi['state']) => !state.canSubmit

export function SubmitButton<TFormValues = unknown>({
  label,
  submittingLabel,
  disabled,
  ...props
}: SubmitButtonProps<TFormValues>) {
  const form = useFormContext()
  return (
    <form.Subscribe
      selector={(state) =>
        [
          typeof disabled === 'function'
            ? disabled(state as unknown as FormState<TFormValues>)
            : typeof disabled === 'boolean'
              ? disabled
              : defaultDisabled(state),
          state.isSubmitting,
        ] as const
      }
    >
      {([isDisabled, isSubmitting]) => (
        <Button type="submit" disabled={isDisabled} {...props}>
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
