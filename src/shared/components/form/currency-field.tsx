import type { ComponentProps, HTMLInputTypeAttribute, ReactNode } from 'react'
import { useId } from 'react'
import { NumericFormat } from 'react-number-format'
import { useFieldContext } from '#/shared/integrations/form/form-hook'
import type { FieldComponentProps } from '#/shared/lib/types/form'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '#shared/components/ui/input-group.tsx'
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field'

type ValueType<T extends HTMLInputTypeAttribute | undefined> = T extends 'number'
  ? number | undefined
  : string

type CurrencyFieldProps<TType extends HTMLInputTypeAttribute | undefined> = FieldComponentProps<
  typeof InputGroupInput,
  {
    label: ReactNode
    description?: string
    type?: TType
    inputGroupProps?: ComponentProps<typeof InputGroup>
    inputGroupAddonProps1?: ComponentProps<typeof InputGroupAddon>
    inputGroupAddonProps2?: ComponentProps<typeof InputGroupAddon>
    inputGroupTextProps?: ComponentProps<typeof InputGroupText>
  },
  'type' | 'value' | 'onChange' | 'defaultValue'
>

export function CurrencyField<TType extends HTMLInputTypeAttribute | undefined = undefined>({
  type,
  label,
  description,
  required,
  fieldProps,
  fieldLabelProps,
  inputGroupProps,
  inputGroupAddonProps1,
  inputGroupAddonProps2,
  inputGroupTextProps,
  ...props
}: CurrencyFieldProps<TType>) {
  const generatedId = useId()
  const field = useFieldContext<ValueType<TType>>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  const fieldId = props.id ?? generatedId

  return (
    <Field {...fieldProps} data-invalid={isInvalid}>
      <FieldLabel {...fieldLabelProps} htmlFor={fieldId} required={required}>
        {label}
      </FieldLabel>
      <InputGroup {...inputGroupProps}>
        <InputGroupAddon {...inputGroupAddonProps1}>
          <InputGroupText {...inputGroupTextProps}>$</InputGroupText>
        </InputGroupAddon>
        <NumericFormat
          customInput={InputGroupInput}
          thousandSeparator=" "
          decimalScale={0} // Force 2 décimales
          fixedDecimalScale // Ajoute les .00 si on tape juste 1000
          allowNegative={false}

          id={fieldId}
          name={field.name}
          value={field.state.value as string | number | undefined}
          onBlur={field.handleBlur}
          onValueChange={(values) => {
            const { floatValue, value } = values

            if (type === 'number') {
              field.handleChange((floatValue ?? null) as ValueType<TType>)
            } else {
              field.handleChange(value as ValueType<TType>)
            }
          }}
          required={required}
          aria-required={required}
          aria-invalid={isInvalid}
          {...props}
          type="text"
        />
        <InputGroupAddon align="inline-end" {...inputGroupAddonProps2}>
          <InputGroupText>USD</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
