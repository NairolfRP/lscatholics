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
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from '#shared/components/ui/native-select.tsx'
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
import { useIsMobile } from '#shared/hooks/use-mobile.ts'

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
  const field = useFieldContext<string | null | undefined>()
  const isMobile = useIsMobile()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  const fieldId = props.id ?? generatedId

  const handleValueChange = (value: string | null | undefined) => field.handleChange(value)

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
          {nullable ? (
            <NativeSelectOption value="">
              {placeholder ?? 'Sélectionnez un district'}
            </NativeSelectOption>
          ) : null}
          {DISTRICT_GROUPS.map((group) => (
            <NativeSelectOptGroup key={group.label} label={group.label}>
              {group.options.map((option) => (
                <NativeSelectOption key={option.value} value={option.value}>
                  {option.label}
                </NativeSelectOption>
              ))}
            </NativeSelectOptGroup>
          ))}
        </NativeSelect>
      ) : (
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
      )}

      {description && descriptionPos === 'after' && (
        <FieldDescription>{description}</FieldDescription>
      )}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
