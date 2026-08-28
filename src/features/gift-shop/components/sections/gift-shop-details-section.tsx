import { getGiftOrderDefaults } from '#/features/gift-shop/constants/gift-shop-defaults.ts'
import { FieldLegend, FieldSet } from '#shared/components/ui/field.tsx'
import { withForm } from '#shared/integrations/form/form-hook.ts'

export const GiftShopDetailsSection = withForm({
  defaultValues: getGiftOrderDefaults(null),
  render: ({ form }) => (
    <FieldSet>
      <FieldLegend className="mb-5 w-full border-b pb-1 font-extrabold">Coordonnées</FieldLegend>

      <form.AppField name="phone">
        {(field) => (
          <field.InputField
            label="Numéro de téléphone"
            placeholder="1234"
            type="tel"
            inputMode="numeric"
            required
            autoComplete="off"
          />
        )}
      </form.AppField>

      <form.AppField name="address">
        {(field) => (
          <field.InputField
            label="Adresse de livraison"
            description="(( Indiquez le nom exact de votre propriété en jeu pour que les objets puissent vous être livrés in-game ))"
            placeholder="123 San Andreas Avenue"
            required
            autoComplete="off"
          />
        )}
      </form.AppField>
    </FieldSet>
  ),
})
