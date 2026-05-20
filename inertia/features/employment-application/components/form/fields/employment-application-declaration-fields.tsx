import { withForm } from '@/lib/form'
import { employmentApplicationFormOpts } from '@/features/employment-application/constants/form_opts'
import { APPLICANT_STATEMENTS } from '#shared/constants/employment.constants'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/shared/components/ui/field'

export const EmploymentApplicantDeclarationFields = withForm({
  ...employmentApplicationFormOpts(),
  render: ({ form }) => (
    <FieldGroup>
      <form.AppField name="applicantDeclaration">
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <FieldSet data-invalid={isInvalid}>
              <FieldGroup data-slot="checkbox-group">
                {APPLICANT_STATEMENTS.map((statement) => (
                  <Field key={statement.id} orientation="horizontal" data-invalid={isInvalid}>
                    <Checkbox
                      id={statement.id}
                      name={field.name}
                      aria-invalid={isInvalid}
                      checked={field.state.value?.includes(statement.id)}
                      onCheckedChange={(checked) => {
                        const current = field.state.value || []
                        if (!checked) {
                          field.handleChange(current.filter((v) => v !== statement.id))
                        } else {
                          field.handleChange([...current, statement.id])
                        }
                      }}
                      required
                    />
                    <FieldLabel htmlFor={statement.id} className="font-normal">
                      {statement.label}
                    </FieldLabel>
                  </Field>
                ))}
              </FieldGroup>
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </FieldSet>
          )
        }}
      </form.AppField>
    </FieldGroup>
  ),
})
