import type { ComponentProps, ReactNode } from 'react'
import { useId } from 'react'
import { CreditCardIcon } from 'lucide-react'
import { PatternFormat } from 'react-number-format'
import { Field, FieldDescription, FieldError, FieldLabel } from '#shared/components/ui/field.tsx'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '#shared/components/ui/input-group.tsx'
import { useFieldContext } from '#shared/integrations/form/form-hook.ts'
import type { FieldComponentProps } from '#shared/lib/types/form.ts'

type IbanFieldProps = FieldComponentProps<
  typeof InputGroupInput,
  {
    label: ReactNode
    description?: string
    inputGroupProps?: ComponentProps<typeof InputGroup>
    inputGroupAddonProps?: ComponentProps<typeof InputGroupAddon>
    inputGroupTextProps?: ComponentProps<typeof InputGroupText>
  },
  'type' | 'value' | 'onChange' | 'defaultValue'
>

export function IbanField({
  label,
  placeholder,
  description,
  required,
  fieldProps,
  fieldLabelProps,
  inputGroupProps,
  inputGroupAddonProps,
  inputGroupTextProps,
  ...props
}: IbanFieldProps) {
  const generatedId = useId()
  const field = useFieldContext<string>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  const fieldId = props.id ?? generatedId

  return (
    <Field {...fieldProps} data-invalid={isInvalid}>
      <FieldLabel {...fieldLabelProps} htmlFor={fieldId} required={required}>
        {label}
      </FieldLabel>
      <InputGroup {...inputGroupProps}>
        <InputGroupAddon {...inputGroupAddonProps}>
          <InputGroupText {...inputGroupTextProps}>
            <CreditCardIcon />
          </InputGroupText>
        </InputGroupAddon>
        <PatternFormat
          type="text"
          inputMode="numeric"
          customInput={InputGroupInput}
          format="#### #### #"
          allowEmptyFormatting

          id={fieldId}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onValueChange={(values, { source }) => {
            if (source === 'event') {
              field.handleChange(values.value)
            }
          }}
          required={required}
          aria-required={required}
          aria-invalid={isInvalid}
          placeholder={placeholder || '0100 1234 5'}
          {...props}
        />
      </InputGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
