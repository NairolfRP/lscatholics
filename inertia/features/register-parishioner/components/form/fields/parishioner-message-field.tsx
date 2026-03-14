import { withForm } from '@/shared/hooks/form'
import { registerParishionerFormOpts } from '@/features/register-parishioner/constants/form_opts'
import { Textarea } from '@/shared/components/ui/textarea'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/shared/components/ui/field'

export const ParishionerMessageField = withForm({
  ...registerParishionerFormOpts({
    id: 0,
    memberid: 0,
    firstname: '',
    lastname: '',
  }),
  render: ({ form }) => (
    <form.AppField name="message">
      {(field) => {
        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
        return (
          <Field data-invalid={isInvalid}>
            <div className="space-y-4">
              <FieldLabel htmlFor={field.name} className="text-lg font-semibold text-gray-900">
                Informations complémentaires
              </FieldLabel>
              <div className="space-y-2">
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Écrire ici..."
                  rows={4}
                  maxLength={300}
                  aria-invalid={isInvalid}
                />
                <FieldDescription>
                  Facultatif. Vous pouvez ajouter tout ce que vous avez envie de nous transmettre :
                  à propos de vous, de votre foyer, de vos besoins, ...
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </div>
            </div>
          </Field>
        )
      }}
    </form.AppField>
  ),
})
