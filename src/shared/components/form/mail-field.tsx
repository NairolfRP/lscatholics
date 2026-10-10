import type { ReactNode } from 'react'
import { useId } from 'react'
import { AtSignIcon } from 'lucide-react'
import { useFieldContext } from '#/shared/integrations/form/form-hook'
import type { FieldComponentProps } from '#/shared/lib/types/form'
import { InputGroup, InputGroupAddon, InputGroupInput } from '#shared/components/ui/input-group.tsx'
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field'

type MailFieldProps = FieldComponentProps<
  typeof InputGroupInput,
  {
    label: ReactNode
    description?: ReactNode
  },
  'type' | 'autoComplete'
>

export function MailField({ label, placeholder, description, required, ...props }: MailFieldProps) {
  const generatedId = useId()
  const field = useFieldContext<string>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  const fieldId = props.id ?? generatedId

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={fieldId} required={required}>
        {label}
      </FieldLabel>
      <InputGroup>
        <InputGroupInput
          type="email"
          id={fieldId}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          placeholder={placeholder ?? 'john.doe@mail.eyefind.fr'}
          required={required}
          aria-required={required}
          aria-invalid={isInvalid}
          autoComplete="off"
          {...props}
        />
        <InputGroupAddon align="inline-start">
          <AtSignIcon />
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>
        {description ? (
          description
        ) : (
          <>
            (( Adresse fictive{' '}
            <a
              href="https://eyefind.fr/mail.php"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline underline-offset-4"
            >
              EyefindMail
            </a>{' '}
            (application de GTA World). JAMAIS une vraie adresse e-mail. ))
          </>
        )}
      </FieldDescription>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
