import { withForm } from '@/shared/hooks/form'
import { volunteersFormOpts } from '@/features/volunteers/constants/form_opts'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/components/ui/field'
import { Textarea } from '@/shared/components/ui/textarea'

export const VolunteerApplicationAvailabilityField = withForm({
  ...volunteersFormOpts(),
  render: ({ form }) => (
    <FieldGroup>
      <form.AppField name="volunteerAvailability">
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name} className="flex items-center gap-2">
                Disponibilités hebdomadaires pour le bénévolat
              </FieldLabel>
              <Textarea
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Indiquez vos disponibilités hebdomadaires pour accomplir des missions bénévoles"
                aria-label="Disponibilités hebdomadaires pour le bénévolat"
                aria-invalid={isInvalid}
                maxLength={250}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          )
        }}
      </form.AppField>
    </FieldGroup>
  ),
})
