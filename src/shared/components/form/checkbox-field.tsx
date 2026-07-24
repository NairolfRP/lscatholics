import type { ReactNode } from 'react'
import { useId } from 'react'
import { useFieldContext } from '#/shared/integrations/form/form-hook'
import type { FieldComponentProps } from '#/shared/lib/types/form'
import { Checkbox } from '#shared/components/ui/checkbox.tsx'
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '../ui/field'

type CheckboxFieldProps = FieldComponentProps<
  typeof Checkbox,
  {
    label: ReactNode
    description?: string
  }
>

export function CheckboxField({
  label,
  description,
  required,
  fieldProps,
  fieldContentProps,
  fieldLabelProps,
  fieldDescriptionProps,
  ...props
}: CheckboxFieldProps) {
  const generatedId = useId()
  const field = useFieldContext<boolean>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  const fieldId = props.id ?? generatedId

  return (
    <Field {...fieldProps} data-invalid={isInvalid}>
      <Checkbox
        id={fieldId}
        name={field.name}
        checked={field.state.value}
        onBlur={field.handleBlur}
        onCheckedChange={field.handleChange}
        required={required}
        aria-required={required}
        aria-invalid={isInvalid}
        {...props}
      />
      <FieldContent {...fieldContentProps}>
        <FieldLabel {...fieldLabelProps} htmlFor={fieldId} required={required}>
          {label}
        </FieldLabel>
        {description && (
          <FieldDescription {...fieldDescriptionProps}>{description}</FieldDescription>
        )}
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </FieldContent>
    </Field>
  )
}
