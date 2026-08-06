import type { ReactNode } from 'react'
import { useId } from 'react'
import { Field, FieldDescription, FieldError, FieldLabel } from '#shared/components/ui/field.tsx'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '#shared/components/ui/input-group.tsx'
import { MarkdownTextarea } from '#shared/components/ui/markdown-textarea.tsx'
import type { Textarea } from '#shared/components/ui/textarea.tsx'
import { useFieldContext } from '#shared/integrations/form/form-hook.ts'
import type { FieldComponentProps } from '#shared/lib/types/form.ts'

type TextareaFieldProps = FieldComponentProps<
  typeof Textarea,
  {
    label: ReactNode
    description?: string
    markdown?: boolean
  },
  'onChange'
>

export function TextareaField({
  label,
  description,
  markdown,
  required,
  maxLength,
  ...props
}: TextareaFieldProps) {
  const generatedId = useId()
  const field = useFieldContext<string>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  const fieldId = props.id ?? generatedId

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={fieldId} required={required}>
        {label}
      </FieldLabel>
      {markdown ? (
        <MarkdownTextarea
          id={fieldId}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={field.handleChange}
          required={required}
          aria-required={required}
          aria-invalid={isInvalid}
          maxLength={maxLength}
          {...props}
        />
      ) : (
        <InputGroup>
          <InputGroupTextarea
            id={fieldId}
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            required={required}
            aria-required={required}
            aria-invalid={isInvalid}
            maxLength={maxLength}
            {...props}
          />
          {maxLength ? (
            <InputGroupAddon align="block-end">
              <InputGroupText className="ml-auto">
                {field.state.value.length}/{maxLength}
              </InputGroupText>
            </InputGroupAddon>
          ) : undefined}
        </InputGroup>
      )}
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
