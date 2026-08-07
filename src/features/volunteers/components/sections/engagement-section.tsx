import { getVolunteerDefaults } from '#/features/volunteers/constants/volunteer-defaults.ts'
import { spokenLanguageOptions } from '#/features/volunteers/constants/volunteer.constants.ts'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#shared/components/ui/accordion.tsx'
import { Badge } from '#shared/components/ui/badge.tsx'
import { FieldDescription, FieldLegend, FieldSet } from '#shared/components/ui/field.tsx'
import { withForm } from '#shared/integrations/form/form-hook.ts'
import { ethnicGroupOptions } from '#shared/constants/ethnicity.ts'

export const EngagementSection = withForm({
  defaultValues: getVolunteerDefaults(null),
  render: ({ form }) => (
    <Accordion multiple defaultValue={['engagement']}>
      <AccordionItem value="engagement">
        <AccordionTrigger>
          <span className="flex items-center gap-2">
            Votre engagement
            <Badge variant="secondary">optionnel</Badge>
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <FieldSet>
            <FieldLegend>Préférences de mission</FieldLegend>
            <FieldDescription>
              Renseignez ces champs pour nous aider à vous proposer des missions adaptées à vos
              envies, vos compétences et votre emploi du temps.
            </FieldDescription>

            <form.AppField name="interestedActivities">
              {(field) => (
                <div className="flex flex-col gap-1">
                  <field.TextareaField
                    label="Quels types de tâches ou d'activités vous intéresseraient ?"
                    description="Distributions alimentaires, groupes de soutien, animations, accompagnement, etc."
                    placeholder="Écrivez ici..."
                    rows={4}
                    maxLength={250}
                  />
                  <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
                    <span className="tabular-nums">{field.state.value?.length ?? 0}/250</span>
                  </div>
                </div>
              )}
            </form.AppField>

            <form.AppField name="volunteerAvailability">
              {(field) => (
                <div className="flex flex-col gap-1">
                  <field.TextareaField
                    label="Disponibilités hebdomadaires pour le bénévolat"
                    placeholder="Indiquez vos disponibilités hebdomadaires pour accomplir des missions bénévoles"
                    rows={4}
                    maxLength={250}
                  />
                  <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
                    <span className="tabular-nums">{field.state.value?.length ?? 0}/250</span>
                  </div>
                </div>
              )}
            </form.AppField>

            <div className="grid grid-cols-1 items-start gap-7 sm:grid-cols-2">
              <form.AppField name="otherLanguages">
                {(field) => (
                  <field.MultiSelectField
                    label="Quelles autres langues maîtrisez-vous ?"
                    descriptionPos="after"
                    errorsPos="after"
                    description="Utile pour nos permanences multilingues et nos actions auprès de toutes les communautés."
                    placeholder="Sélectionnez une ou plusieurs langues"
                    values={spokenLanguageOptions}
                  />
                )}
              </form.AppField>

              <form.AppField name="ethnicity">
                {(field) => (
                  <field.SelectField
                    label="Ethnie"
                    description="Pour assurer un suivi équitable et adapté de nos équipes."
                    descriptionPos="after"
                    placeholder="Sélectionnez une ethnie"
                    values={[
                      { label: 'Sélectionnez une ethnie', value: null },
                      ...ethnicGroupOptions,
                    ]}
                  />
                )}
              </form.AppField>
            </div>
          </FieldSet>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
})
