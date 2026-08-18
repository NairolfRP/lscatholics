import { employmentApplicationFormOptions } from '#/features/job-application/form/employment-application-form-options.ts'
import { FieldLegend, FieldSet } from '#shared/components/ui/field.tsx'
import { withForm } from '#shared/integrations/form/form-hook.ts'
import type { CharacterWithFaction } from '#shared/types/character.types.ts'

export const ContactSection = withForm({
  ...employmentApplicationFormOptions,
  props: {
    currentCharacter: null as CharacterWithFaction | null | undefined,
  },
  render: ({ form, currentCharacter }) => (
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
          {(field) => (
            <field.DistrictSelectField
              label="District"
              description="Sélectionnez le district dans lequel votre adresse se situe."
              descriptionPos="after"
              placeholder="Sélectionnez un district"
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

        <form.AppField name="iban" defaultValue={currentCharacter?.bankRoutingNumber ?? ''}>
          {(field) => (
            <field.IbanField
              label="IBAN"
              description="Indiquez votre IBAN personnel pour les versements de salaires et de primes."
              required
              autoComplete="off"
            />
          )}
        </form.AppField>
      </div>
    </FieldSet>
  ),
})
