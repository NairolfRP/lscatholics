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
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from '#/shared/components/ui/multi-select'
import { useFieldContext } from '#/shared/integrations/form/form-hook'
import type { FieldComponentProps, SelectValues } from '#/shared/lib/types/form'

type MutliSelectProps = FieldComponentProps<
  typeof MultiSelect,
  {
    label: string
    description?: string | ReactNode
    descriptionPos?: 'before' | 'after'
    errorsPos?: 'before' | 'after'
    placeholder?: string
    values: (SelectValues & { disabled?: boolean })[]
    selectTriggerProps?: Omit<
      ComponentPropsWithoutRef<typeof MultiSelectTrigger>,
      'id' | 'aria-invalid'
    >
    selectValueProps?: ComponentPropsWithoutRef<typeof MultiSelectValue>
    selectContentProps?: ComponentPropsWithoutRef<typeof MultiSelectContent>
  },
  'values' | 'children'
>

export function MultiSelectField({
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
  selectValueProps,
  selectContentProps,
  ...props
}: MutliSelectProps) {
  const generatedId = useId()
  const field = useFieldContext<(string | null)[]>()

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

      <MultiSelect
        values={field.state.value.map((v) => String(v))}
        onValuesChange={field.handleChange}
        {...props}
      >
        <MultiSelectTrigger {...selectTriggerProps} id={fieldId} aria-invalid={isInvalid}>
          <MultiSelectValue {...selectValueProps} placeholder={placeholder} />
        </MultiSelectTrigger>
        <MultiSelectContent {...selectContentProps}>
          <MultiSelectGroup>
            {values.map((item) => (
              <MultiSelectItem key={item.label} value={item.value} disabled={item.disabled}>
                {item.label}
              </MultiSelectItem>
            ))}
          </MultiSelectGroup>
        </MultiSelectContent>
      </MultiSelect>

      {description && descriptionPos === 'after' && (
        <FieldDescription>{description}</FieldDescription>
      )}
      {isInvalid && errorsPos === 'after' && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
