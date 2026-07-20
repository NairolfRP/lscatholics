import type { ReactNode } from 'react'
import { useId } from 'react'
import { DateTimePicker } from '#/shared/components/ui/date-time-picker'
import { useFieldContext } from '#/shared/integrations/form/form-hook'
import type { FieldComponentProps } from '#/shared/lib/types/form'
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field'

type DateTimePickerFieldProps = FieldComponentProps<
  typeof DateTimePicker,
  {
    label: ReactNode
    description?: string
  }
>

export function DateTimePickerField({
  label,
  description,
  required,
  ...props
}: DateTimePickerFieldProps) {
  const generatedId = useId()
  const field = useFieldContext<Date | undefined>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  const fieldId = props.id ?? generatedId

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={fieldId} className="items-center gap-1.5">
        {label}
        {required ? <span className="text-destructive">*</span> : null}
      </FieldLabel>
      <DateTimePicker
        id={fieldId}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={field.handleChange}
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
