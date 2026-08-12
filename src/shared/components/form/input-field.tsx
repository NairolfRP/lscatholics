import type { HTMLInputTypeAttribute, ReactNode } from 'react'
import { useId } from 'react'
import { Input } from '#/shared/components/ui/input'
import { useFieldContext } from '#/shared/integrations/form/form-hook'
import type { FieldComponentProps } from '#/shared/lib/types/form'
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field'

type ValueType<T extends HTMLInputTypeAttribute | undefined> = T extends 'number'
  ? number | undefined
  : string

type InputFieldProps<TType extends HTMLInputTypeAttribute | undefined> = FieldComponentProps<
  typeof Input,
  {
    label: ReactNode
    description?: ReactNode
    type?: TType
  },
  'type'
>

export function InputField<TType extends HTMLInputTypeAttribute | undefined = undefined>({
  type,
  label,
  description,
  required,
  ...props
}: InputFieldProps<TType>) {
  const generatedId = useId()
  const field = useFieldContext<ValueType<TType>>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  const fieldId = props.id ?? generatedId

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={fieldId} required={required}>
        {label}
      </FieldLabel>
      <Input
        type={type}
        id={fieldId}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => {
          const val = e.target.value
          if (type === 'number') {
            const numVal = !val || val.trim() === '' ? null : Number(val)
            return field.handleChange(numVal as ValueType<TType>)
          }
          field.handleChange(val as ValueType<TType>)
        }}
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
