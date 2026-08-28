import { getGiftOrderDefaults } from '#/features/gift-shop/constants/gift-shop-defaults.ts'
import { FieldLegend, FieldSet } from '#shared/components/ui/field.tsx'
import { withForm } from '#shared/integrations/form/form-hook.ts'

export const GiftShopOptionsSection = withForm({
  defaultValues: getGiftOrderDefaults(null),
  render: ({ form }) => (
    <FieldSet>
      <FieldLegend className="mb-5 w-full border-b pb-1 font-extrabold">Confirmation</FieldLegend>

      <form.AppField name="fleecaConfirmation">
        {(field) => (
          <field.CheckboxField
            label={
              <span className="inline-block">
                (( Je confirme que je suis bien connecté sur l'
                <a
                  href="https://fleeca.gta.world"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline underline-offset-4"
                >
                  application web Fleeca
                </a>{' '}
                de GTA World. Dans le cas contraire, la redirection vers le paiement échouera et
                tout devra être recommencé. ))
              </span>
            }
            fieldProps={{ orientation: 'horizontal' }}
            required
          />
        )}
      </form.AppField>
    </FieldSet>
  ),
})
