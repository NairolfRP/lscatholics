import { MapPin } from 'lucide-react'
import { withForm } from '@/shared/hooks/form'
import { registerParishionerFormOpts } from '@/features/register-parishioner/constants/form_opts'
import { Input } from '@/shared/components/ui/input'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/shared/components/ui/field'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import type { GTA5DistrictId } from '#shared/constants/districts.constants'
import { DistrictSelectGroups } from '@/shared/components/fields/district-select/district-select-groups'

export const ParishionerAddressFields = withForm({
  ...registerParishionerFormOpts({
    id: 0,
    memberid: 0,
    firstname: '',
    lastname: '',
    bankRoutingNumber: '',
  }),
  render: ({ form }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <MapPin className="w-5 h-5" />
        Adresse
      </h3>

      <FieldGroup className="grid md:grid-cols-2 items-start gap-4">
        <form.AppField name="address">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Adresse postale *</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  required
                  placeholder="123 Main Street"
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                <FieldDescription>
                  (( Indiquez le nom exact de votre propriété pour que nous puissions vous envoyer
                  des colis depuis le script La Poste. ))
                </FieldDescription>
              </Field>
            )
          }}
        </form.AppField>

        <form.AppField name="district">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>District *</FieldLabel>
                </FieldContent>
                <Select
                  name={field.name}
                  value={field.state.value}
                  onValueChange={(v) => field.handleChange((v as GTA5DistrictId) ?? undefined)}
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
      </FieldGroup>
    </div>
  ),
})
