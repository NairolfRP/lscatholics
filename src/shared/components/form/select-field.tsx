import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { useId } from 'react'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '#/shared/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/shared/components/ui/select'
import { useFieldContext } from '#/shared/integrations/form/form-hook'
import type { FieldComponentProps, SelectValues } from '#/shared/lib/types/form'

type SelectFieldProps = FieldComponentProps<
  typeof Select,
  {
    label: string
    description?: string | ReactNode
    descriptionPos?: 'before' | 'after'
    errorsPos?: 'before' | 'after'
    placeholder?: string
    values: Array<SelectValues>
    selectTriggerProps?: Omit<ComponentPropsWithoutRef<typeof SelectTrigger>, 'id' | 'aria-invalid'>
    selectContentProps?: ComponentPropsWithoutRef<typeof SelectContent>
  }
>

export function SelectField({
  fieldProps,
  fieldContentProps,
  fieldLabelProps,
  values,
  label,
  placeholder,
  description,
  descriptionPos = 'before',
  errorsPos = 'before',
  selectTriggerProps,
  selectContentProps,
  ...props
}: SelectFieldProps) {
  const generatedId = useId()
  const field = useFieldContext<string>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  const fieldId = props.id ?? generatedId

  return (
    <Field {...fieldProps} data-invalid={isInvalid}>
      <FieldContent {...fieldContentProps}>
        <FieldLabel {...fieldLabelProps} htmlFor={fieldId}>
          {label}
        </FieldLabel>
        {description && descriptionPos === 'before' && (
          <FieldDescription>{description}</FieldDescription>
        )}
        {isInvalid && errorsPos === 'before' && <FieldError errors={field.state.meta.errors} />}
      </FieldContent>

      <Select
        items={values}
        name={field.name}
        value={field.state.value}
        onValueChange={(v) => field.handleChange(v as string)}
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

      {description && descriptionPos === 'after' && (
        <FieldDescription>{description}</FieldDescription>
      )}
      {isInvalid && errorsPos === 'after' && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
