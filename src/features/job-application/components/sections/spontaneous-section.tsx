import { EMPLOYMENT_APPLICATION_MAX_LENGTHS } from '#/features/job-application/constants/employment-application.constants.tsx'
import { employmentApplicationFormOptions } from '#/features/job-application/form/employment-application-form-options.ts'
import { FieldDescription, FieldLegend, FieldSet } from '#shared/components/ui/field.tsx'
import { withForm } from '#shared/integrations/form/form-hook.ts'

export const SpontaneousSection = withForm({
  ...employmentApplicationFormOptions,
  render: ({ form }) => (
    <FieldSet>
      <FieldLegend className="mb-5 w-full border-b pb-2 font-extrabold">
        Votre projet professionnel
      </FieldLegend>
      <FieldDescription>
        Aucune offre d'emploi actuelle ne vous correspond&nbsp;? Dites-nous ce que vous cherchez.
      </FieldDescription>

      <form.AppField name="desiredPosition">
        {(field) => (
          <field.InputField
            label="Poste proposé"
            placeholder="Exemple : agent d'entretien"
            maxLength={EMPLOYMENT_APPLICATION_MAX_LENGTHS.POSITION}
            required
            autoComplete="off"
          />
        )}
      </form.AppField>
    </FieldSet>
  ),
})
