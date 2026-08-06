import type { ComponentPropsWithoutRef } from 'react'
import { useId } from 'react'
import { useFieldContext } from '#/shared/integrations/form/form-hook.ts'
import type { FieldComponentProps } from '#/shared/lib/types/form.ts'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '#shared/components/ui/field.tsx'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '#shared/components/ui/select.tsx'
import { DISTRICT_GROUPS } from '#shared/constants/districts.constants.ts'

type DistrictSelectFieldProps = FieldComponentProps<
  typeof Select,
  {
    label: string
    description?: string
    descriptionPos?: 'before' | 'after'
    placeholder?: string
    selectTriggerProps?: Omit<ComponentPropsWithoutRef<typeof SelectTrigger>, 'id' | 'aria-invalid'>
    nullable?: boolean
  },
  'onValueChange'
>

export function DistrictSelectField({
  fieldProps,
  fieldContentProps,
  fieldLabelProps,
  label,
  placeholder,
  description,
  descriptionPos = 'before',
  selectTriggerProps,
  required,
  nullable,
  ...props
}: DistrictSelectFieldProps) {
  const generatedId = useId()
  const field = useFieldContext<string | null>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  const fieldId = props.id ?? generatedId

  return (
    <Field {...fieldProps} data-invalid={isInvalid}>
      <FieldContent {...fieldContentProps}>
        <FieldLabel required={required} {...fieldLabelProps} htmlFor={fieldId}>
          {label}
        </FieldLabel>
        {description && descriptionPos === 'before' && (
          <FieldDescription>{description}</FieldDescription>
        )}
      </FieldContent>

      <Select
        items={DISTRICT_GROUPS.flatMap((group) => group.options)}
        name={field.name}
        value={field.state.value}
        onValueChange={(v) => field.handleChange(v as string | null)}
        required={required}
        {...props}
      >
        <SelectTrigger {...selectTriggerProps} id={fieldId} aria-invalid={isInvalid}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {nullable ? (
            <SelectGroup>
              <SelectItem value={null}>{placeholder ?? 'Sélectionnez un district'}</SelectItem>
            </SelectGroup>
          ) : null}
          {DISTRICT_GROUPS.map((group) => (
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

      {description && descriptionPos === 'after' && (
        <FieldDescription>{description}</FieldDescription>
      )}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
