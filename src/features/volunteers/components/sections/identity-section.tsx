import { getVolunteerDefaults } from '#/features/volunteers/constants/volunteer-defaults.ts'
import { FieldLegend, FieldSet } from '#shared/components/ui/field.tsx'
import { withForm } from '#shared/integrations/form/form-hook.ts'
import type { Character } from '#shared/types/character.types.ts'

export const IdentitySection = withForm({
  defaultValues: getVolunteerDefaults(null),
  props: {} as { currentCharacter: Character | null | undefined },
  render: ({ form, currentCharacter }) => (
    <FieldSet>
      <FieldLegend>Votre identité</FieldLegend>

      <div className="grid grid-cols-1 items-start gap-7 sm:grid-cols-2">
        <form.AppField name="firstname">
          {(field) => (
            <field.InputField
              key={`current-character-firstname-${currentCharacter?.id ?? 'unknown'}`}
              label="Prénom"
              placeholder="John"
              required
              autoComplete="off"
            />
          )}
        </form.AppField>

        <form.AppField name="lastname">
          {(field) => (
            <field.InputField
              key={`current-character-lastname-${currentCharacter?.id ?? 'unknown'}`}
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
              description="L'âge minimum pour devenir bénévole est de 18 ans."
              required
            />
          )}
        </form.AppField>
      </div>
    </FieldSet>
  ),
})
