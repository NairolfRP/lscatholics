import { getVolunteerDefaults } from '#/features/volunteers/constants/volunteer-defaults.ts'
import { requiredHoursReasonOptions } from '#/features/volunteers/constants/volunteer.constants.ts'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#shared/components/ui/accordion.tsx'
import { Badge } from '#shared/components/ui/badge.tsx'
import { FieldLegend, FieldSet } from '#shared/components/ui/field.tsx'
import { Typography } from '#shared/components/ui/typography.tsx'
import { withForm } from '#shared/integrations/form/form-hook.ts'

export const RequiredHoursSection = withForm({
  defaultValues: getVolunteerDefaults(null),
  render: ({ form }) => (
    <Accordion multiple defaultValue={['required-hours']}>
      <AccordionItem value="required-hours">
        <AccordionTrigger>
          <span className="flex items-center gap-2">
            Service communautaire obligatoire
            <Badge variant="secondary">optionnel</Badge>
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <FieldSet>
            <FieldLegend>Heures de bénévolat requises</FieldLegend>
            <Typography variant="small" className="text-muted-foreground italic">
              Veuillez remplir cette section uniquement{' '}
              <strong>si vous êtes obligé de réaliser du bénévolat</strong> (tribunal, lycée,
              université…).
            </Typography>

            <form.AppField name="requiredHours.reason">
              {(field) => (
                <field.SelectField
                  label="Pour quelles raisons êtes-vous tenu de réaliser un service communautaire ou du bénévolat ?"
                  placeholder="Sélectionnez une réponse"
                  values={[
                    { label: 'Sélectionnez une réponse', value: null },
                    ...requiredHoursReasonOptions,
                  ]}
                />
              )}
            </form.AppField>

            <form.Subscribe selector={(state) => !!state.values.requiredHours.reason}>
              {(hasReason) =>
                hasReason && (
                  <form.AppField name="requiredHours.deadline">
                    {(field) => (
                      <field.InputField
                        label="À quelle échéance devez-vous valider vos heures ?"
                        placeholder="Indiquez la date limite"
                        maxLength={50}
                        required
                        autoComplete="off"
                      />
                    )}
                  </form.AppField>
                )
              }
            </form.Subscribe>
          </FieldSet>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
})
