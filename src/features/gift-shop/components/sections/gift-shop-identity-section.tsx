import { getGiftOrderDefaults } from '#/features/gift-shop/constants/gift-shop-defaults.ts'
import { FieldLegend, FieldSet } from '#shared/components/ui/field.tsx'
import { civilTitleOptions } from '#shared/constants/civil-title.ts'
import { withForm } from '#shared/integrations/form/form-hook.ts'
import type { Character } from '#shared/types/character.types.ts'

export const GiftShopIdentitySection = withForm({
  defaultValues: getGiftOrderDefaults(null),
  props: {} as { currentCharacter: Character | null | undefined },
  render: ({ form, currentCharacter }) => (
    <FieldSet>
      <FieldLegend className="mb-5 w-full border-b pb-1 font-extrabold">
        Informations personnelles
      </FieldLegend>

      <form.AppField name="title">
        {(field) => (
          <field.SelectField
            label="Titre de civilité"
            placeholder="Sélectionnez un titre"
            values={civilTitleOptions}
            required
          />
        )}
      </form.AppField>

      <div className="grid grid-cols-1 items-start gap-7 sm:grid-cols-2">
        <form.AppField name="firstname">
          {(field) => (
            <field.CharacterNameField
              label="Prénom"
              placeholder="John"
              required
              currentCharacterId={currentCharacter?.id}
            />
          )}
        </form.AppField>

        <form.AppField name="lastname">
          {(field) => (
            <field.CharacterNameField
              label="Nom de famille"
              placeholder="Doe"
              required
              currentCharacterId={currentCharacter?.id}
            />
          )}
        </form.AppField>
      </div>
    </FieldSet>
  ),
})
