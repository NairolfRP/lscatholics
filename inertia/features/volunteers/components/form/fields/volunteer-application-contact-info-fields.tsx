import { withForm } from '@/lib/form'
import { volunteersFormOpts } from '@/features/volunteers/constants/form_opts'
import { Field, FieldContent, FieldError, FieldLabel } from '@/shared/components/ui/field'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import type { GTA5DistrictId } from '#shared/constants/districts.constants'
import { DistrictSelectGroups } from '@/shared/components/fields/district-select/district-select-groups'

export const VolunteerApplicationContactInfoFields = withForm({
  ...volunteersFormOpts(),
  render: ({ form }) => (
    <>
      <form.AppField name="address">
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel required htmlFor={field.name}>
                Adresse
              </FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                maxLength={255}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="123 Main Street"
                aria-label="Adresse"
                aria-invalid={isInvalid}
                required
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                <FieldLabel required htmlFor={field.name}>
                  District
                </FieldLabel>
              </FieldContent>
              <Select
                name={field.name}
                value={field.state.value}
                onValueChange={(v) => field.handleChange((v as GTA5DistrictId) ?? undefined)}
                required
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

      <form.AppField name="phone">
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel required htmlFor={field.name} className="flex items-center gap-2">
                Numéro de téléphone
              </FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                type="tel"
                required
                placeholder="1234567"
                aria-label="Numéro de téléphone"
                aria-invalid={isInvalid}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          )
        }}
      </form.AppField>

      <form.AppField name="emergencyPhone">
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name} className="flex items-center gap-2">
                N° de téléphone à appeler en cas d'urgence
              </FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                type="tel"
                placeholder="1234567"
                aria-label="N° de téléphone à appeler en cas d'urgence"
                aria-invalid={isInvalid}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          )
        }}
      </form.AppField>
    </>
  ),
})
