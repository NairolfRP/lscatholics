import { withForm } from '@/lib/form'
import { volunteersFormOpts } from '@/features/volunteers/constants/form_opts'
import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/shared/components/ui/number-field'

export const VolunteerApplicationAgeField = withForm({
  ...volunteersFormOpts(),
  render: ({ form }) => (
    <form.AppField name="age">
      {(field) => {
        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
        return (
          <Field data-invalid={isInvalid}>
            <FieldLabel required htmlFor={field.name}>
              Âge
            </FieldLabel>
            <NumberField
              id={field.name}
              min={16}
              max={120}
              value={field.state.value ?? null}
              onChange={(v) => field.handleChange(v ?? undefined)}
              required
            >
              <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput id={field.name} aria-invalid={isInvalid} />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>
            {isInvalid && <FieldError errors={field.state.meta.errors} />}
          </Field>
        )
      }}
    </form.AppField>
  ),
})
