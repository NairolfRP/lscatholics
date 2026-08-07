import { getDonationDefaults } from '#/features/donate/constants/donate-defaults.ts'
import { FieldLegend, FieldSet } from '#shared/components/ui/field.tsx'
import { Separator } from '#shared/components/ui/separator.tsx'
import { withForm } from '#shared/integrations/form/form-hook.ts'

export const DonateOptionsSection = withForm({
  defaultValues: getDonationDefaults(null),
  render: ({ form }) => (
    <FieldSet>
      <FieldLegend className="mb-5 w-full border-b pb-1 font-extrabold">Options de don</FieldLegend>

      <form.AppField name="anonymous">
        {(field) => (
          <field.CheckboxField
            label="Je souhaite que ma donation reste privée, ce qui veut dire qu'elle ne sera ni affichée ni communiquée publiquement."
            fieldProps={{ orientation: 'horizontal' }}
          />
        )}
      </form.AppField>

      <Separator />

      <form.AppField name="fleecaConfirmation">
        {(field) => (
          <field.CheckboxField
            label={
              <span className="inline-block">
                (( Je confirme que je suis BIEN CONNECTÉ sur l'
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
