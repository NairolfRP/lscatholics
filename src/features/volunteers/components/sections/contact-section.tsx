import { DISTRICT_GROUPS } from '#shared/constants/districts.constants.ts'
import { DistrictSelectField } from '#shared/components/form/district-select-field.tsx'
import { getVolunteerDefaults } from '#/features/volunteers/constants/volunteer-defaults.ts'
import { FieldLegend, FieldSet } from '#shared/components/ui/field.tsx'
import { withForm } from '#shared/integrations/form/form-hook.ts'

export const ContactSection = withForm({
  defaultValues: getVolunteerDefaults(null),
  render: ({ form }) => (
    <FieldSet>
      <FieldLegend>Vos coordonnées</FieldLegend>

      <div className="grid grid-cols-1 items-start gap-7 sm:grid-cols-2">
        <form.AppField name="phone">
          {(field) => (
            <field.InputField
              type="tel"
              inputMode="tel"
              label="Numéro de téléphone"
              description="Le numéro doit contenir entre 3 et 8 chiffres."
              placeholder="12345"
              required
              autoComplete="off"
            />
          )}
        </form.AppField>

        <form.AppField name="emergencyPhone">
          {(field) => (
            <field.InputField
              type="tel"
              inputMode="tel"
              label="N° à appeler en cas d'urgence"
              description="Optionnel — une personne à prévenir en cas de besoin."
              placeholder="12345"
              autoComplete="off"
            />
          )}
        </form.AppField>

        <form.AppField name="address">
          {(field) => (
            <field.InputField
              label="Adresse"
              placeholder="Ex. 12 Ginger Street"
              required
              autoComplete="off"
            />
          )}
        </form.AppField>

        <form.AppField name="district">
          {() => (
            <DistrictSelectField
              label="Quartier / Ville"
              description="Choisissez la ville ou le quartier dans lequel votre adresse se situe."
              descriptionPos="after"
              placeholder="Sélectionnez un quartier"
              values={DISTRICT_GROUPS}
              required
            />
          )}
        </form.AppField>
      </div>
    </FieldSet>
  ),
})
