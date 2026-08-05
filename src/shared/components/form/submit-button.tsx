import type { ComponentPropsWithRef, ReactNode } from 'react'
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
  label: string | ReactNode | ((state: FormState<TFormValues>) => string | ReactNode)
  submittingLabel?: string | ((state: FormState<TFormValues>) => string)
  disabled?: boolean | ((state: FormState<TFormValues>) => boolean)
}

const defaultDisabled = (state: AnyFormApi['state']) => !state.canSubmit

export function SubmitButton<TFormValues = unknown>({
  label,
  submittingLabel,
  disabled,
  form: formId,
  ...props
}: SubmitButtonProps<TFormValues>) {
  const form = useFormContext()
  return (
    <form.Subscribe
      selector={(state) => {
        const typedState = state as unknown as FormState<TFormValues>

        return [
          typeof disabled === 'function'
            ? disabled(state as unknown as FormState<TFormValues>)
            : typeof disabled === 'boolean'
              ? disabled
              : defaultDisabled(state),
          state.isSubmitting,
          typeof label === 'function' ? label(typedState) : label,
          typeof submittingLabel === 'function' ? submittingLabel(typedState) : submittingLabel,
        ] as const
      }}
    >
      {([isDisabled, isSubmitting, resolvedLabel, resolvedSubmittingLabel]) => (
        <Button form={formId || form.formId} type="submit" disabled={isDisabled} {...props}>
          {resolvedSubmittingLabel && isSubmitting ? (
            <SubmittingLabel label={resolvedSubmittingLabel} />
          ) : (
            resolvedLabel
          )}
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
