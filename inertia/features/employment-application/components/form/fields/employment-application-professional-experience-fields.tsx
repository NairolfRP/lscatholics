import { Briefcase, Plus, Trash2 } from 'lucide-react'
import { withForm } from '@/lib/form'
import { employmentApplicationFormOpts } from '@/features/employment-application/constants/form_opts'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Separator } from '@/shared/components/ui/separator'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/shared/components/ui/field'
import { Empty, EmptyContent, EmptyMedia, EmptyTitle } from '@/shared/components/ui/empty'

const EMPTY_EXPERIENCE = {
  companyName: '',
  position: '',
  isCurrentPosition: false,
  reasonForLeaving: '',
  startDate: '',
  endDate: '',
}

export const EmploymentApplicationProfessionalExperienceFields = withForm({
  ...employmentApplicationFormOpts(),
  render: ({ form }) => (
    <form.AppField name="professionalExperience" mode="array">
      {(field) => (
        <FieldSet className="gap-6">
          <FieldGroup className="gap-6">
            {field.state.value.length === 0 ? (
              <Empty className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                <EmptyMedia variant="icon">
                  <Briefcase />
                </EmptyMedia>
                <EmptyTitle>Aucune expérience professionnelle ajoutée</EmptyTitle>
                <EmptyContent>
                  <Button type="button" size="sm" onClick={() => field.pushValue(EMPTY_EXPERIENCE)}>
                    <Plus />
                    Ajouter une expérience
                  </Button>
                </EmptyContent>
              </Empty>
            ) : (
              field.state.value.map((_, index) => (
                <div key={index} className="border rounded-lg p-4 sm:p-6 space-y-4 bg-card">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                        {index + 1}
                      </div>
                      <h4 className="font-medium text-sm sm:text-base">Expérience #{index + 1}</h4>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Supprimer l'expérience ${index + 1}`}
                      onClick={() => field.removeValue(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <form.AppField name={`professionalExperience[${index}].companyName`}>
                      {(subField) => {
                        const isInvalid =
                          subField.state.meta.isTouched && !subField.state.meta.isValid
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel required htmlFor={`company-${index}`}>
                              Nom de la compagnie
                            </FieldLabel>
                            <Input
                              id={`company-${index}`}
                              name={subField.name}
                              value={subField.state.value}
                              onBlur={subField.handleBlur}
                              onChange={(e) => subField.handleChange(e.target.value)}
                              type="text"
                              placeholder="Ex: Eternal Word Television Network"
                              maxLength={100}
                              aria-invalid={isInvalid}
                              required
                            />
                            {isInvalid && <FieldError errors={subField.state.meta.errors} />}
                          </Field>
                        )
                      }}
                    </form.AppField>

                    <form.AppField name={`professionalExperience[${index}].position`}>
                      {(subField) => {
                        const isInvalid =
                          subField.state.meta.isTouched && !subField.state.meta.isValid
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel required htmlFor={`position-${index}`}>
                              Poste / Fonction
                            </FieldLabel>
                            <Input
                              id={`position-${index}`}
                              name={subField.name}
                              value={subField.state.value}
                              onBlur={subField.handleBlur}
                              onChange={(e) => subField.handleChange(e.target.value)}
                              type="text"
                              placeholder="Ex: Assistant administratif"
                              maxLength={100}
                              aria-invalid={isInvalid}
                              required
                            />
                            {isInvalid && <FieldError errors={subField.state.meta.errors} />}
                          </Field>
                        )
                      }}
                    </form.AppField>

                    <form.AppField name={`professionalExperience[${index}].isCurrentPosition`}>
                      {(subField) => {
                        const isInvalid =
                          subField.state.meta.isTouched && !subField.state.meta.isValid
                        return (
                          <Field orientation="horizontal" data-invalid={isInvalid}>
                            <Checkbox
                              id={`current-position-${index}`}
                              checked={!!subField.state.value}
                              onCheckedChange={(v) =>
                                subField.handleChange(v === 'indeterminate' ? false : v)
                              }
                              aria-invalid={isInvalid}
                            />
                            <div className="flex-1 space-y-1 leading-none">
                              <FieldLabel
                                htmlFor={`current-position-${index}`}
                                className="cursor-pointer"
                              >
                                Je travaille actuellement à ce poste
                              </FieldLabel>
                              <FieldDescription className="text-xs">
                                Cochez cette case si vous occupez toujours ce poste
                              </FieldDescription>
                            </div>
                            {isInvalid && <FieldError errors={subField.state.meta.errors} />}
                          </Field>
                        )
                      }}
                    </form.AppField>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <form.AppField name={`professionalExperience[${index}].startDate`}>
                        {(subField) => {
                          const isInvalid =
                            subField.state.meta.isTouched && !subField.state.meta.isValid
                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldLabel required htmlFor={`start-date-${index}`}>
                                Date de début
                              </FieldLabel>
                              <Input
                                id={`start-date-${index}`}
                                name={subField.name}
                                value={subField.state.value ?? ''}
                                onBlur={subField.handleBlur}
                                onChange={(e) => subField.handleChange(e.target.value)}
                                type="month"
                                aria-invalid={isInvalid}
                                required
                              />
                              {isInvalid && <FieldError errors={subField.state.meta.errors} />}
                            </Field>
                          )
                        }}
                      </form.AppField>

                      <form.Subscribe
                        selector={(state) =>
                          state.values.professionalExperience?.[index]?.isCurrentPosition
                        }
                      >
                        {(isCurrentPosition) =>
                          !isCurrentPosition && (
                            <form.AppField name={`professionalExperience[${index}].endDate`}>
                              {(subField) => {
                                const isInvalid =
                                  subField.state.meta.isTouched && !subField.state.meta.isValid
                                return (
                                  <Field data-invalid={isInvalid}>
                                    <FieldLabel required htmlFor={`end-date-${index}`}>
                                      Date de fin
                                    </FieldLabel>
                                    <Input
                                      id={`end-date-${index}`}
                                      name={subField.name}
                                      value={subField.state.value ?? ''}
                                      onBlur={subField.handleBlur}
                                      onChange={(e) => subField.handleChange(e.target.value)}
                                      type="month"
                                      aria-invalid={isInvalid}
                                      required
                                    />
                                    {isInvalid && (
                                      <FieldError errors={subField.state.meta.errors} />
                                    )}
                                  </Field>
                                )
                              }}
                            </form.AppField>
                          )
                        }
                      </form.Subscribe>
                    </div>

                    <form.Subscribe
                      selector={(state) =>
                        state.values.professionalExperience?.[index]?.isCurrentPosition
                      }
                    >
                      {(isCurrentPosition) =>
                        !isCurrentPosition && (
                          <form.AppField name={`professionalExperience[${index}].reasonForLeaving`}>
                            {(subField) => {
                              const isInvalid =
                                subField.state.meta.isTouched && !subField.state.meta.isValid
                              return (
                                <Field data-invalid={isInvalid}>
                                  <FieldLabel required htmlFor={`reason-${index}`}>
                                    Raison du départ
                                  </FieldLabel>
                                  <FieldContent>
                                    <Input
                                      id={`reason-${index}`}
                                      name={subField.name}
                                      value={subField.state.value}
                                      onBlur={subField.handleBlur}
                                      onChange={(e) => subField.handleChange(e.target.value)}
                                      placeholder="Ex: Nouvelle opportunité, relocation, fin de contrat..."
                                      maxLength={255}
                                      aria-invalid={isInvalid}
                                      required
                                    />
                                    <FieldDescription className="text-xs">
                                      Maximum 255 caractères
                                    </FieldDescription>
                                    {isInvalid && (
                                      <FieldError errors={subField.state.meta.errors} />
                                    )}
                                  </FieldContent>
                                </Field>
                              )
                            }}
                          </form.AppField>
                        )
                      }
                    </form.Subscribe>
                  </div>
                </div>
              ))
            )}

            {field.state.value.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="default"
                className="w-full sm:w-auto"
                disabled={field.state.value.length >= 3}
                onClick={() => field.pushValue(EMPTY_EXPERIENCE)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une expérience
                <span className="ml-2 text-muted-foreground text-xs">
                  ({field.state.value.length}/3)
                </span>
              </Button>
            )}

            {field.state.meta.errors.length > 0 && <FieldError errors={field.state.meta.errors} />}
          </FieldGroup>
        </FieldSet>
      )}
    </form.AppField>
  ),
})
