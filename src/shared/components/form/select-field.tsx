import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { useId } from 'react'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '#/shared/components/ui/field'
import { NativeSelect, NativeSelectOption } from '#/shared/components/ui/native-select'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/shared/components/ui/select'
import { useIsMobile } from '#/shared/hooks/use-mobile'
import { useFieldContext } from '#/shared/integrations/form/form-hook'
import type { FieldComponentProps, SelectValues } from '#/shared/lib/types/form'

type SelectFieldProps<TValue extends string | null | undefined = string | null | undefined> =
  FieldComponentProps<
    typeof Select,
    {
      label: string
      description?: string | ReactNode
      descriptionPos?: 'before' | 'after'
      errorsPos?: 'before' | 'after'
      placeholder?: string
      values: SelectValues[]
      onValueChange?: (
        value: TValue,
        handleChange: ReturnType<typeof useFieldContext<TValue>>['handleChange']
      ) => void
      selectTriggerProps?: Omit<
        ComponentPropsWithoutRef<typeof SelectTrigger>,
        'id' | 'aria-invalid'
      >
      selectContentProps?: ComponentPropsWithoutRef<typeof SelectContent>
    },
    'onValueChange'
  >

export function SelectField({
  fieldProps,
  fieldContentProps,
  fieldLabelProps,
  values,
  onValueChange,
  label,
  placeholder,
  description,
  descriptionPos = 'before',
  errorsPos = 'before',
  selectTriggerProps,
  selectContentProps,
  required,
  ...props
}: SelectFieldProps) {
  const generatedId = useId()
  const field = useFieldContext<string | null | undefined>()
  const isMobile = useIsMobile()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  const fieldId = props.id ?? generatedId

  const handleValueChange = (value: string | null | undefined) =>
    onValueChange ? onValueChange(value, field.handleChange) : field.handleChange(value)

  const hasPlaceholderValue = values.some((item) => item.value == null)

  return (
    <Field {...fieldProps} data-invalid={isInvalid}>
      <FieldContent {...fieldContentProps}>
        <FieldLabel required={required} {...fieldLabelProps} htmlFor={fieldId}>
          {label}
        </FieldLabel>
        {description && descriptionPos === 'before' && (
          <FieldDescription>{description}</FieldDescription>
        )}
        {isInvalid && errorsPos === 'before' && <FieldError errors={field.state.meta.errors} />}
      </FieldContent>

      {isMobile ? (
        <NativeSelect
          className={
            typeof selectTriggerProps?.className === 'string'
              ? selectTriggerProps.className
              : undefined
          }
          id={fieldId}
          aria-invalid={isInvalid}
          name={field.name}
          value={field.state.value ?? ''}
          onChange={(e) => {
            const value = e.target.value
            handleValueChange(value === '' ? null : value)
          }}
          required={required}
        >
          {!hasPlaceholderValue && (
            <NativeSelectOption value="" disabled>
              {placeholder ?? ''}
            </NativeSelectOption>
          )}
          {values.map((item) => (
            <NativeSelectOption key={item.label} value={item.value ?? ''}>
              {item.label}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      ) : (
        <Select
          items={values}
          name={field.name}
          value={field.state.value ?? null}
          onValueChange={(v) => handleValueChange(v as string | null | undefined)}
          required={required}
          {...props}
        >
          <SelectTrigger {...selectTriggerProps} id={fieldId} aria-invalid={isInvalid}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent {...selectContentProps}>
            {values.map((item) => (
              <SelectItem key={item.label} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {description && descriptionPos === 'after' && (
        <FieldDescription>{description}</FieldDescription>
      )}
      {isInvalid && errorsPos === 'after' && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
