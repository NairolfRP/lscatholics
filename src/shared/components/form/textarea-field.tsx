import type { ReactNode } from 'react'
import { useId } from 'react'
import { Field, FieldDescription, FieldError, FieldLabel } from '#shared/components/ui/field.tsx'
import { MarkdownTextarea } from '#shared/components/ui/markdown-textarea.tsx'
import { Textarea } from '#shared/components/ui/textarea.tsx'
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
          {...props}
        />
      ) : (
        <Textarea
          id={fieldId}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          required={required}
          aria-required={required}
          aria-invalid={isInvalid}
          {...props}
        />
      )}
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
