import { withForm } from '@/lib/form'
import { createJobFormOpts } from '@/features/jobs/constants/form_opts'
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '@/shared/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/shared/components/ui/input-group'
import { X } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

export const JobDashboardRequirementsField = withForm({
  ...createJobFormOpts,
  render: ({ form }) => {
    return (
      <div className="space-y-2">
        <form.AppField name="requirements" mode="array">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <FieldSet className="gap-4">
                <FieldLegend variant="label">Conditions requises</FieldLegend>
                <FieldGroup className="gap-4">
                  {field.state.value?.map((_, i) => (
                    <form.AppField key={i} name={`requirements[${i}]`}>
                      {(subField) => {
                        const isSubFieldInvalid =
                          subField.state.meta.isTouched && !subField.state.meta.isValid
                        return (
                          <Field orientation="horizontal" data-invalid={isSubFieldInvalid}>
                            <FieldContent>
                              <InputGroup>
                                <InputGroupInput
                                  type="text"
                                  id={`form-requirements-${i}`}
                                  name={subField.name}
                                  value={subField.state.value}
                                  onBlur={subField.handleBlur}
                                  onChange={(e) => subField.handleChange(e.target.value)}
                                  aria-invalid={isSubFieldInvalid}
                                  placeholder="Être titulaire du permis de conduire"
                                  autoComplete="off"
                                />
                                <InputGroupAddon align="inline-end">
                                  <InputGroupButton
                                    type="button"
                                    variant="ghost"
                                    size="icon-xs"
                                    aria-label={`Supprimer la ligne ${i + 1}`}
                                    onClick={() => field.removeValue(i)}
                                  >
                                    <X />
                                  </InputGroupButton>
                                </InputGroupAddon>
                              </InputGroup>
                              {isSubFieldInvalid && (
                                <FieldError errors={subField.state.meta.errors} />
                              )}
                            </FieldContent>
                          </Field>
                        )
                      }}
                    </form.AppField>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => field.pushValue('')}
                  >
                    Ajouter
                  </Button>
                </FieldGroup>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </FieldSet>
            )
          }}
        </form.AppField>
      </div>
    )
  },
})
