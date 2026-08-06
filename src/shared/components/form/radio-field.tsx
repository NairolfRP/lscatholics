import type { ReactNode } from 'react'
import { useId } from 'react'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldSet,
} from '#shared/components/ui/field.tsx'
import { RadioGroup, RadioGroupItem } from '#shared/components/ui/radio-group.tsx'
import { useFieldContext } from '#shared/integrations/form/form-hook.ts'

export function RadioField({
  label,
  description,
  options,
  required,
}: {
  label: ReactNode
  description?: string
  options: readonly { value: string; label: string }[]
  required?: boolean
}) {
  const generatedId = useId()
  const field = useFieldContext<string | undefined>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <FieldSet data-invalid={isInvalid}>
      <FieldLabel required={required}>{label}</FieldLabel>
      {description && <FieldDescription>{description}</FieldDescription>}

      <RadioGroup
        name={field.name}
        value={field.state.value}
        onValueChange={field.handleChange}
        onBlur={field.handleBlur}
        required={required}
        aria-invalid={isInvalid}
      >
        {options.map((option) => (
          <FieldLabel
            key={option.value}
            htmlFor={`${generatedId}-${option.value}`}
            className="font-normal"
          >
            <Field orientation="horizontal" data-invalid={isInvalid}>
              <FieldContent>
                <FieldLabel>{option.label}</FieldLabel>
              </FieldContent>
              <RadioGroupItem
                id={`${generatedId}-${option.value}`}
                value={option.value}
                aria-invalid={isInvalid}
              />
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </FieldSet>
  )
}
