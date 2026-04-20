import { withForm } from '@/shared/hooks/form'
import { donateFormOpts } from '@/features/donate/constants/form_opts'
import { DonateFieldsGrid } from '@/features/donate/components/donate-fields-grid'
import { Field, FieldContent, FieldError, FieldLabel } from '@/shared/components/ui/field'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import type { GTA5DistrictId } from '#shared/constants/districts.constants'
import { DistrictSelectGroups } from '@/shared/components/fields/district-select/district-select-groups'

export const DonateAddressFields = withForm({
  ...donateFormOpts(),
  render: ({ form }) => {
    return (
      <>
        <DonateFieldsGrid>
          <form.AppField name="address">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Adresse</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="text"
                    placeholder="123 San Andreas Avenue"
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.AppField>

          <form.Subscribe selector={(state) => state.values.address}>
            {(address) => (
              <form.AppField name="district">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldContent>
                        <FieldLabel required={!!address?.length} htmlFor={field.name}>
                          District
                        </FieldLabel>
                      </FieldContent>
                      <Select
                        name={field.name}
                        value={field.state.value ?? ''}
                        onValueChange={(v: GTA5DistrictId | 'none') => {
                          if (!v || v === 'none') {
                            field.handleChange(undefined)
                          } else {
                            field.handleChange(v)
                          }
                        }}
                        required={!!address?.length}
                      >
                        <SelectTrigger id={field.name} className="w-full" aria-invalid={isInvalid}>
                          <SelectValue id={field.name} placeholder="Sélectionnez un district" />
                        </SelectTrigger>
                        <SelectContent>
                          <DistrictSelectGroups />
                        </SelectContent>
                      </Select>
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              </form.AppField>
            )}
          </form.Subscribe>
        </DonateFieldsGrid>
      </>
    )
  },
})
