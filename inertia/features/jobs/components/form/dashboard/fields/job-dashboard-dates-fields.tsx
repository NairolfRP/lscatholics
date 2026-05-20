import { withForm } from '@/lib/form'
import { createJobFormOpts } from '@/features/jobs/constants/form_opts'
import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field'
import DateTimePicker from '@/shared/components/ui/datetime-picker'

export const JobDashboardDatesFields = withForm({
  ...createJobFormOpts,
  render: ({ form }) => {
    return (
      <>
        <form.AppField name="postedAt">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Date de publication</FieldLabel>
                <DateTimePicker
                  id={field.name}
                  value={field.state.value}
                  onChange={(v) => {
                    if (!v) {
                      return field.handleChange(undefined as unknown as Date)
                    }
                    field.handleChange(v)
                  }}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.AppField>

        <form.AppField name="expiresAt">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Date de fermeture</FieldLabel>
                <DateTimePicker
                  id={field.name}
                  value={field.state.value}
                  onChange={(v) => {
                    field.handleChange(v ?? undefined)
                  }}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.AppField>
      </>
    )
  },
})
