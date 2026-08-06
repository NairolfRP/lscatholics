import { BriefcaseBusinessIcon, PlusIcon, TrashIcon } from 'lucide-react'
import { EMPLOYMENT_APPLICATION_MAX_LENGTHS } from '#/features/job-application/constants/employment-application.constants.tsx'
import { getEmploymentApplicationDefaults } from '#/features/job-application/utils/employment-application-defaults.ts'
import { Button } from '#shared/components/ui/button.tsx'
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from '#shared/components/ui/empty.tsx'
import { FieldDescription, FieldLegend, FieldSet } from '#shared/components/ui/field.tsx'
import { withForm } from '#shared/integrations/form/form-hook.ts'

const MAX_EXPERIENCES = EMPLOYMENT_APPLICATION_MAX_LENGTHS.MAX_PROFESSIONAL_EXPERIENCE

const EMPTY_EXPERIENCE = {
  isCurrentPosition: true,
  companyName: '',
  position: '',
  startDate: '',
} as const

export const ExperienceSection = withForm({
  defaultValues: getEmploymentApplicationDefaults(null),
  render: ({ form }) => (
    <FieldSet>
      <FieldLegend className="mb-5 w-full border-b pb-2 font-extrabold">
        Expérience professionnelle
      </FieldLegend>
      <FieldDescription>
        Renseignez vos expériences professionnelles pertinentes. Vous pouvez en ajouter jusqu'à{' '}
        {MAX_EXPERIENCES}.
      </FieldDescription>

      <form.Subscribe selector={(state) => state.values.professionalExperience}>
        {(experiences) => (
          <div className="flex flex-col gap-6">
            {experiences.length === 0 && (
              <Empty className="border border-dashed">
                <EmptyMedia variant="icon">
                  <BriefcaseBusinessIcon />
                </EmptyMedia>
                <EmptyTitle>Aucune expérience renseignée</EmptyTitle>
                <EmptyDescription>
                  Si vous n'avez encore jamais travaillé, laissez cette section vide.
                </EmptyDescription>
              </Empty>
            )}

            {experiences.map((_, index) => (
              <div key={index} className="space-y-7 rounded-lg border p-5">
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-2 font-medium">
                    <BriefcaseBusinessIcon className="size-4 text-muted-foreground" />
                    Expérience n°{index + 1}
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Supprimer cette expérience"
                    onClick={() => void form.removeFieldValue('professionalExperience', index)}
                  >
                    <TrashIcon />
                  </Button>
                </div>

                <div className="grid grid-cols-1 items-start gap-7 sm:grid-cols-2">
                  <form.AppField name={`professionalExperience[${index}].companyName`}>
                    {(field) => (
                      <field.InputField
                        label="Nom de la compagnie"
                        placeholder="Ex. Eternal Word Television Network"
                        maxLength={100}
                        required
                        autoComplete="off"
                      />
                    )}
                  </form.AppField>

                  <form.AppField name={`professionalExperience[${index}].position`}>
                    {(field) => (
                      <field.InputField
                        label="Poste / Fonction"
                        placeholder="Ex. Assistant administratif"
                        maxLength={100}
                        required
                        autoComplete="off"
                      />
                    )}
                  </form.AppField>
                </div>

                <form.AppField name={`professionalExperience[${index}].isCurrentPosition`}>
                  {(field) => (
                    <field.YesNoField label="Occupez-vous toujours ce poste ?" required />
                  )}
                </form.AppField>

                <div className="grid grid-cols-1 items-start gap-7 sm:grid-cols-2">
                  <form.AppField name={`professionalExperience[${index}].startDate`}>
                    {(field) => (
                      <field.InputField
                        type="month"
                        label="Date de début"
                        description="Format : AAAA-MM"
                        required
                      />
                    )}
                  </form.AppField>

                  <form.Subscribe
                    selector={(state) =>
                      !state.values.professionalExperience[index]?.isCurrentPosition
                    }
                  >
                    {(isPastPosition) =>
                      isPastPosition && (
                        <form.AppField name={`professionalExperience[${index}].endDate`}>
                          {(field) => (
                            <field.InputField
                              type="month"
                              label="Date de fin"
                              description="Format : AAAA-MM"
                              required
                            />
                          )}
                        </form.AppField>
                      )
                    }
                  </form.Subscribe>
                </div>

                <form.Subscribe
                  selector={(state) =>
                    !state.values.professionalExperience[index]?.isCurrentPosition
                  }
                >
                  {(isPastPosition) =>
                    isPastPosition && (
                      <form.AppField name={`professionalExperience[${index}].reasonForLeaving`}>
                        {(field) => (
                          <field.TextareaField
                            label="Raison du départ"
                            placeholder="Décrivez brièvement les raisons de votre départ"
                            rows={3}
                            maxLength={255}
                            required
                          />
                        )}
                      </form.AppField>
                    )
                  }
                </form.Subscribe>
              </div>
            ))}

            <div>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                disabled={experiences.length >= MAX_EXPERIENCES}
                onClick={() => form.pushFieldValue('professionalExperience', EMPTY_EXPERIENCE)}
              >
                <PlusIcon />
                Ajouter une expérience professionnelle
              </Button>
            </div>
          </div>
        )}
      </form.Subscribe>
    </FieldSet>
  ),
})
