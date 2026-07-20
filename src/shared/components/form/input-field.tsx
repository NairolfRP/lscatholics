import type { ReactNode } from 'react'
import { useId } from 'react'
import { Input } from '#/shared/components/ui/input'
import { useFieldContext } from '#/shared/integrations/form/form-hook'
import type { FieldComponentProps } from '#/shared/lib/types/form'
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field'

type InputFieldProps = FieldComponentProps<
  typeof Input,
  {
    label: ReactNode
    description?: string
  }
>

export function InputField({ label, description, required, ...props }: InputFieldProps) {
  const generatedId = useId()
  const field = useFieldContext<string>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  const fieldId = props.id ?? generatedId

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={fieldId} required={required}>
        {label}
      </FieldLabel>
      <Input
        id={fieldId}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        required={required}
        aria-required={required}
        aria-invalid={isInvalid}
        {...props}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
