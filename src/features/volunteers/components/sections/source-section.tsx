import { getVolunteerDefaults } from '#/features/volunteers/constants/volunteer-defaults.ts'
import {
  APPLICATION_SOURCE,
  applicationSourceOptions,
} from '#/features/volunteers/constants/volunteer.constants.ts'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#shared/components/ui/accordion.tsx'
import { Badge } from '#shared/components/ui/badge.tsx'
import { FieldDescription, FieldLegend, FieldSet } from '#shared/components/ui/field.tsx'
import { withForm } from '#shared/integrations/form/form-hook.ts'

export const SourceSection = withForm({
  defaultValues: getVolunteerDefaults(null),
  render: ({ form }) => (
    <Accordion multiple defaultValue={['source']}>
      <AccordionItem value="source">
        <AccordionTrigger>
          <span className="flex items-center gap-2">
            Comment nous avez-vous connu ?<Badge variant="secondary">optionnel</Badge>
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <FieldSet>
            <FieldLegend>Source de votre intérêt</FieldLegend>
            <FieldDescription>
              Ces informations nous aident à mieux faire connaître nos actions.
            </FieldDescription>

            <form.AppField name="applicantSource.type">
              {(field) => (
                <field.SelectField
                  label="Comment avez-vous entendu parler du bénévolat dans notre organisation ?"
                  placeholder="Sélectionnez une réponse"
                  values={[
                    { label: 'Sélectionnez une réponse', value: null },
                    ...applicationSourceOptions,
                  ]}
                />
              )}
            </form.AppField>

            <form.Subscribe selector={(state) => state.values.applicantSource.type}>
              {(type) =>
                type === APPLICATION_SOURCE.EMPLOYEE_REFERRAL && (
                  <form.AppField name="applicantSource.employeeReferral">
                    {(field) => (
                      <field.InputField
                        label="Indiquez l'identité de l'employé"
                        placeholder="Jane Doe"
                        maxLength={100}
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
