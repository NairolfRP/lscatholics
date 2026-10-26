import type { ReactNode } from 'react'
import { useId } from 'react'
import { Input } from '#/shared/components/ui/input'
import { useFieldContext } from '#/shared/integrations/form/form-hook'
import type { FieldComponentProps } from '#/shared/lib/types/form'
import { Field, FieldError, FieldLabel } from '../ui/field'

type CharacterNameFieldProps = FieldComponentProps<
  typeof Input,
  {
    label: ReactNode
    placeholder: string
    currentCharacterId?: string | number
  }
>

export function CharacterNameField({
  label,
  placeholder,
  currentCharacterId,
  required,
  ...props
}: CharacterNameFieldProps) {
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
        key={`current-character-${field.name}-${currentCharacterId ?? 'unknown'}`}
        id={fieldId}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        aria-required={required}
        aria-invalid={isInvalid}
        autoComplete="off"
        {...props}
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
