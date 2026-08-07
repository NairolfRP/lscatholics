import { getDonationDefaults } from '#/features/donate/constants/donate-defaults.ts'
import { FieldLegend, FieldSet } from '#shared/components/ui/field.tsx'
import { withForm } from '#shared/integrations/form/form-hook.ts'

export const DonateAddressSection = withForm({
  defaultValues: getDonationDefaults(null),
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
            autoComplete="off"
          />
        )}
      </form.AppField>

      <div className="grid grid-cols-1 items-start gap-7 sm:grid-cols-2">
        <form.AppField name="address">
          {(field) => (
            <field.InputField
              label="Adresse"
              placeholder="123 San Andreas Avenue"
              autoComplete="street-address"
            />
          )}
        </form.AppField>

        <form.Subscribe selector={(state) => state.values.address}>
          {(address) => (
            <form.AppField name="district">
              {(field) => (
                <field.DistrictSelectField
                  label="District"
                  placeholder="Sélectionnez un district"
                  required={!!address}
                  nullable
                />
              )}
            </form.AppField>
          )}
        </form.Subscribe>
      </div>
    </FieldSet>
  ),
})
