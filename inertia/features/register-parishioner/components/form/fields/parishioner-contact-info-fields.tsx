import { PhoneCall } from 'lucide-react'
import { withForm } from '@/shared/hooks/form'
import { registerParishionerFormOpts } from '@/features/register-parishioner/constants/form_opts'
import { Input } from '@/shared/components/ui/input'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/components/ui/field'

const items = [
  { name: 'phone', label: 'Numéro de téléphone', required: true },
  { name: 'emergencyPhone', label: "N° de téléphone à appeler en cas d'urgence", required: false },
] as const

export const ParishionerContactInfoFields = withForm({
  ...registerParishionerFormOpts({
    id: 0,
    memberid: 0,
    firstname: '',
    lastname: '',
  }),
  render: ({ form }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <PhoneCall className="size-5" />
        Informations de contact
      </h3>

      <FieldGroup>
        <div className="grid md:grid-cols-2 items-start gap-4">
          {items.map((item) => (
            <form.AppField key={item.name} name={item.name}>
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name} className="flex items-center gap-2">
                      {item.label} {item.required && '*'}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      type="tel"
                      required={item.required}
                      placeholder="1234567"
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            </form.AppField>
          ))}
        </div>
      </FieldGroup>
    </div>
  ),
})
