import { withForm } from '@/shared/hooks/form'
import { donateFormOpts } from '@/features/donate/constants/form_opts'
import { Input } from '@/shared/components/ui/input'
import { Field, FieldContent, FieldError, FieldLabel } from '@/shared/components/ui/field'
import { DonateFieldsGrid } from '@/features/donate/components/donate-fields-grid'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/shared/components/ui/number-field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { ETHNIC_GROUPS, EthnicGroupId } from '#shared/constants/ethnicity.constants'
import { DonateOrganizationFields } from '@/features/donate/components/form/fields/donate-organization-fields'

const IDENTITY_FIELDS = [
  { name: 'firstname', label: 'Prénom', placeholder: 'John' },
  { name: 'lastname', label: 'Nom de famille', placeholder: 'Doe' },
] as const

export const DonatePersonalInfoFields = withForm({
  ...donateFormOpts(),
  props: {
    characterId: 0 as number | undefined,
  },
  render: ({ form, characterId }) => (
    <>
      <h3 className="text-lg font-medium text-gray-900">Informations personnelles</h3>

      <DonateFieldsGrid key={`current-character-${characterId}`}>
        {IDENTITY_FIELDS.map((item) => (
          <form.AppField key={item.name} name={item.name}>
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel required htmlFor={field.name}>
                    {item.label}
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="text"
                    placeholder={item.placeholder}
                    aria-invalid={isInvalid}
                    required
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.AppField>
        ))}
      </DonateFieldsGrid>

      <DonateOrganizationFields form={form} />

      <DonateFieldsGrid>
        <form.AppField name="age">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Âge</FieldLabel>
                <NumberField
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(v) => (v ? field.handleChange(v) : field.handleChange(undefined))}
                  onBlur={field.handleBlur}
                  aria-invalid={isInvalid}
                  min={0}
                >
                  <NumberFieldContent>
                    <NumberFieldDecrement />
                    <NumberFieldInput />
                    <NumberFieldIncrement />
                  </NumberFieldContent>
                </NumberField>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.AppField>

        <form.AppField name="ethnicity">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>Ethnie</FieldLabel>
                </FieldContent>
                <Select
                  name={field.name}
                  value={field.state.value ?? ''}
                  onValueChange={(v) => {
                    if (!v || v === 'none') {
                      field.handleChange(undefined)
                    } else {
                      field.handleChange(v as EthnicGroupId)
                    }
                  }}
                >
                  <SelectTrigger id={field.name} className="w-full" aria-invalid={isInvalid}>
                    <SelectValue placeholder="Sélectionnez une ethnie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="none" disabled={!field.state.value}>
                        N/A
                      </SelectItem>
                      <SelectSeparator />
                      {ETHNIC_GROUPS.map((ethnicGroup) => (
                        <SelectItem key={ethnicGroup.id} value={ethnicGroup.id}>
                          {ethnicGroup.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.AppField>
      </DonateFieldsGrid>

      <form.AppField name="phone">
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Numéro de téléphone</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                type="tel"
                placeholder="1234"
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
