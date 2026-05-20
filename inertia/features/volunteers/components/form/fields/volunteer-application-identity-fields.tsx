import { withForm } from '@/lib/form'
import { volunteersFormOpts } from '@/features/volunteers/constants/form_opts'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/components/ui/field'
import { Input } from '@/shared/components/ui/input'
import { useCurrentCharacter } from '@/shared/hooks/use_current_character'

const fields = [
  { id: 'firstname' as const, label: 'Prénom', placeholder: 'John' },
  { id: 'middleName' as const, label: 'Deuxième prénom', placeholder: 'Allen' },
  { id: 'lastname' as const, label: 'Nom de famille', placeholder: 'Doe' },
]

export const VolunteerApplicationIdentityFields = withForm({
  ...volunteersFormOpts(),
  render: ({ form }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const currentCharacter = useCurrentCharacter()
    return (
      <FieldGroup
        key={currentCharacter?.id}
        className="grid items-start grid-cols-1 sm:grid-cols-3 md:grid-cols-2 laptop:grid-cols-3"
      >
        {fields.map((item) => (
          <form.AppField key={item.id} name={item.id}>
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel required={item.id !== 'middleName'} htmlFor={field.name}>
                    {item.label}
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    maxLength={30}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={item.placeholder}
                    aria-label={item.label}
                    aria-invalid={isInvalid}
                    required={item.id !== 'middleName'}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.AppField>
        ))}
      </FieldGroup>
    )
  },
})
