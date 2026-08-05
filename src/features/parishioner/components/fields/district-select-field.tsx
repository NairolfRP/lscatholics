import type { ComponentPropsWithoutRef } from 'react'
import { useId } from 'react'
import { useFieldContext } from '#/shared/integrations/form/form-hook.ts'
import type { FieldComponentProps } from '#/shared/lib/types/form.ts'
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '#shared/components/ui/field.tsx'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '#shared/components/ui/select.tsx'
import type { DistrictGroup } from '#/features/parishioner/constants/districts.constants.ts'

type DistrictSelectFieldProps = FieldComponentProps<
  typeof Select,
  {
    label: string
    description?: string
    descriptionPos?: 'before' | 'after'
    placeholder?: string
    values: DistrictGroup[]
    selectTriggerProps?: Omit<
      ComponentPropsWithoutRef<typeof SelectTrigger>,
      'id' | 'aria-invalid'
    >
  },
  'onValueChange'
>

export function DistrictSelectField({
  fieldProps,
  fieldContentProps,
  fieldLabelProps,
  values,
  label,
  placeholder,
  description,
  descriptionPos = 'before',
  selectTriggerProps,
  required,
  ...props
}: DistrictSelectFieldProps) {
  const generatedId = useId()
  const field = useFieldContext<string>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  const fieldId = props.id ?? generatedId

  return (
    <Field {...fieldProps} data-invalid={isInvalid}>
      <FieldContent {...fieldContentProps}>
        <FieldLabel required={required} {...fieldLabelProps} htmlFor={fieldId}>
          {label}
        </FieldLabel>
        {description && descriptionPos === 'before' && <FieldDescription>{description}</FieldDescription>}
      </FieldContent>

      <Select
        items={values.flatMap((group) => group.options)}
        name={field.name}
        value={field.state.value}
        onValueChange={field.handleChange}
        required={required}
        {...props}
      >
        <SelectTrigger {...selectTriggerProps} id={fieldId} aria-invalid={isInvalid}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {values.map((group) => (
            <SelectGroup key={group.label}>
              <SelectLabel>{group.label}</SelectLabel>
              {group.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>

      {description && descriptionPos === 'after' && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
