import { getDonationDefaults } from '#/features/donate/constants/donate-defaults.ts'
import { FieldLegend, FieldSet } from '#shared/components/ui/field.tsx'
import { ethnicGroupOptions } from '#shared/constants/ethnicity.ts'
import { withForm } from '#shared/integrations/form/form-hook.ts'
import type { Character } from '#shared/types/character.types.ts'

export const DonateIdentitySection = withForm({
  defaultValues: getDonationDefaults(null),
  props: {} as { currentCharacter: Character | null | undefined },
  render: ({ form, currentCharacter }) => (
    <FieldSet>
      <FieldLegend className="mb-5 w-full border-b pb-1 font-extrabold">
        Informations personnelles
      </FieldLegend>

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
      </div>

      <form.AppField name="isOrganization">
        {(field) => (
          <field.CheckboxField
            label="Je fais un don au nom d'une organisation ou d'une société"
            fieldProps={{ orientation: 'horizontal' }}
          />
        )}
      </form.AppField>

      <form.Subscribe selector={(state) => state.values.isOrganization}>
        {(isOrganization) => {
          if (!isOrganization) return null
          return (
            <form.AppField name="organizationName">
              {(field) => (
                <field.InputField
                  label="Nom de l'organisation"
                  placeholder="Doe Corporation"
                  required
                  autoComplete="off"
                />
              )}
            </form.AppField>
          )
        }}
      </form.Subscribe>

      <div className="grid grid-cols-1 items-start gap-7 sm:grid-cols-2">
        <form.AppField name="age">
          {(field) => (
            <field.InputField label="Âge" placeholder="25" inputMode="numeric" autoComplete="off" />
          )}
        </form.AppField>

        <form.AppField name="ethnicity">
          {(field) => (
            <field.SelectField
              label="Ethnie"
              placeholder="Sélectionnez une ethnie"
              values={[{ label: 'Sélectionnez une ethnie', value: null }, ...ethnicGroupOptions]}
            />
          )}
        </form.AppField>
      </div>
    </FieldSet>
  ),
})
