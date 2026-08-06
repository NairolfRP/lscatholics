import {
  getEmploymentApplicationDefaults,
} from '#/features/job-application/utils/employment-application-defaults.ts'
import { DistrictSelectField } from '#shared/components/form/district-select-field.tsx'
import { FieldLegend, FieldSet } from '#shared/components/ui/field.tsx'
import { DISTRICT_GROUPS } from '#shared/constants/districts.constants.ts'
import { withForm } from '#shared/integrations/form/form-hook.ts'

export const ContactSection = withForm({
  defaultValues: getEmploymentApplicationDefaults(null),
  render: ({ form }) => (
    <FieldSet>
      <FieldLegend className="mb-5 w-full border-b pb-2 font-extrabold">
        Vos coordonnées
      </FieldLegend>

      <div className="grid grid-cols-1 items-start gap-7 sm:grid-cols-2">
        <form.AppField name="address">
          {(field) => (
            <field.InputField
              label="Adresse"
              placeholder="Ex. 123 San Andreas Avenue"
              required
              autoComplete="off"
            />
          )}
        </form.AppField>

        <form.AppField name="district">
          {() => (
            <DistrictSelectField
              label="District"
              description="Sélectionnez le district dans lequel votre adresse se situe."
              descriptionPos="after"
              placeholder="Sélectionnez un district"
              values={DISTRICT_GROUPS}
              required
            />
          )}
        </form.AppField>

        <form.AppField name="phone">
          {(field) => (
            <field.InputField
              type="tel"
              inputMode="tel"
              label="Numéro de téléphone"
              description="Le numéro doit contenir entre 3 et 8 chiffres."
              placeholder="12345678"
              required
              autoComplete="off"
            />
          )}
        </form.AppField>
      </div>
    </FieldSet>
  ),
})
