import { genderOptions } from '#/features/job-application/constants/employment-application.constants.tsx'
import { employmentApplicationFormOptions } from '#/features/job-application/form/employment-application-form-options.ts'
import { FieldLegend, FieldSet } from '#shared/components/ui/field.tsx'
import { withForm } from '#shared/integrations/form/form-hook.ts'
import type { Character } from '#shared/types/character.types.ts'

export const IdentitySection = withForm({
  ...employmentApplicationFormOptions,
  props: {
    currentCharacter: null as Character | null | undefined,
  },
  render: ({ form, currentCharacter }) => (
    <FieldSet>
      <FieldLegend className="mb-5 w-full border-b pb-2 font-extrabold">Votre identité</FieldLegend>

      <div className="grid grid-cols-1 items-start gap-7 sm:grid-cols-2">
        <form.AppField name="firstname" defaultValue={currentCharacter?.firstname ?? ''}>
          {(field) => (
            <field.InputField label="Prénom" placeholder="John" required autoComplete="off" />
          )}
        </form.AppField>

        <form.AppField name="lastname" defaultValue={currentCharacter?.lastname ?? ''}>
          {(field) => (
            <field.InputField
              label="Nom de famille"
              placeholder="Doe"
              required
              autoComplete="off"
            />
          )}
        </form.AppField>

        <form.AppField name="middleName">
          {(field) => (
            <field.InputField label="Deuxième prénom" placeholder="Allen" autoComplete="off" />
          )}
        </form.AppField>

        <form.AppField name="age">
          {(field) => (
            <field.InputField
              label="Âge"
              placeholder="25"
              inputMode="numeric"
              description="Certains emplois peuvent avoir une limite d'âge. Vérifiez préalablement les conditions de l'offre."
              required
            />
          )}
        </form.AppField>
      </div>

      <form.AppField name="gender">
        {(field) => <field.RadioField label="Je suis" options={genderOptions} required />}
      </form.AppField>
    </FieldSet>
  ),
})
